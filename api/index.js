// mincer directives processor are listed bellow

(function(global) {
    'use strict';

    var express = require('express');
    var app     = express();
  
    var server = require('http').createServer(app)
      , io     = require('socket.io').listen(server);

    console.log("__dirname: "+__dirname);
    app.use(express.favicon());
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.static(__dirname + '/../public'));

    server.listen(3000);
    console.log('Listening on port 3000');

    var buffer = "";
    var socket;

    var BTSP = require('bluetooth-serial-port');
    var serial = new BTSP.BluetoothSerialPort();

    var robot = {
        "leftSpeed":  0,
        "rightSpeed": 0,
        "battery":    0,
        "ram":        0,
        "heading":    0,
        "servoPos":   0,
        "distance":   0
    };

    var state = {
        NOT_CONNECTED: 0,
        PENDING:       1,
        CONNECTED:     2
    };

    var bluetooth = {
        "name":       "linvor",
        "address":    "20-13-05-07-38-71",
        "channel":    1,
        "connection": state.NOT_CONNECTED // 0= not connected, 1=connecting, 2=connected
    };

    app.get('/robot', function(req, res) {
        res.send(robot, 200);
    });

    app.get('/robot/:name', function(req, res) {
        if( typeof robot[req.params.name] !== 'undefined' ) {
            res.send(""+ robot[req.params.name], 200);
        }
        else {
            res.send('undefined: ' + req.params.name, 404);
        }
    });

    app.post('/robot/:name', function(req, res) {
        console.log("POST /robot/" + req.params.name + " %o", req);

        if( bluetooth.connection !== state.CONNECTED) {
            res.send("bluetooth not connected", 500);
        }
        else if( typeof robot[req.params.name] !== 'undefined' && typeof req.body.value !== 'undefined') {
            serial.write(new Buffer([0x47, 0x01, 0x4, 0xFF, 0xFF, 0xFF, 0xFF]), function(err, bytesWritten) {
                if (err) {
                    console.log(err);
                }
            });
            console.log("Previous value of robot."+req.params.name +" = " + robot[req.params.name]);
            robot[req.params.name] = req.body.value;
            console.log("New value of robot."+req.params.name +" = " + robot[req.params.name] + "(should be equal to "+req.body.value+")");
            res.send(200);
        }
        else {
            res.send('undefined: ' + req.params.name + ' or missing value key in data', 404);
        }
    });

    app.get('/bluetooth', function(req, res) {
        res.send(bluetooth, 200);
    });

    app.post('/bluetooth', function(req, res) {
        console.log("POST /bluetooth " + JSON.stringify(req.body));
        if( !req.body.address || !req.body.channel ) {
            res.send('bad request: no address or channel specified', 500);
        }
        else {
            console.log("try connecting to " + req.body.address);
            serial.connect(req.body.address, req.body.channel, onBtConnect );
            res.send('connection on-going', 200);
            bluetooth.connection = state.PENDING;
        }
    });

    app.post('/emit', function(req, res) {
        console.log("POST /emit " + JSON.stringify(req.body));
        if( typeof socket !== 'undefined') {
            var data = req.body;
            if( data.hasOwnProperty('leftSpeed') &&
                data.hasOwnProperty('rightSpeed') &&
                data.hasOwnProperty('heading') &&
                data.hasOwnProperty('battery') &&
                data.hasOwnProperty('ram') &&
                data.hasOwnProperty('servoPos') &&
                data.hasOwnProperty('distance') ) {
                var msg = { 
                    key: "emit",
                    value: req.body 
                };
                robot = data;
                console.log("emit ", msg);
                socket.emit('update', msg);
                res.send('message emitted', 200);
            }
            else {
                res.send('data not formatted', 500);
            }
        }
        else {
            res.send('no active socket', 500);
        }
    });

    function onBtConnect() {
        console.log("[onBtConnect]");
        bluetooth.connection = state.CONNECTED;
    }

    serial.on('finished', function(data) {
        console.log("End of bluetooth connection");
        bluetooth.connection = 0;
    });

    serial.on('data', function(data) {
        buffer+=data.toString();
        if( buffer.match(/^.*\r\n$/) !== null) {
            console.log('Received: %o ' + buffer);
            buffer = "";
        }
    });

    io.sockets.on('connection', function (s) {
        socket = s;
        console.log("io.socket is ready");
        socket.on('change', function (data) {
            console.log('received data : ', data);
        });
    });


})(this);
