// mincer directives processor are listed bellow

(function(global) {
    'use strict';

    var express = require('express');
    var app     = express();
    var hexy    = require('hexy');
    var port    = 3000; 
    var server  = require('http').createServer(app);
    var io      = require('socket.io').listen(server);

    io.set('log level', 1);
    app.use(express.favicon());
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.static(__dirname + '/../public'));

    server.listen(port);
    console.log('Listening on port ' + port);

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
        if( bluetooth.connection !== state.CONNECTED) {
            res.send("bluetooth not connected", 500);
        }
        else if( typeof socket === 'undefined') {
            res.send('no active socket', 500);
        }
        else if( typeof robot[req.params.name] !== 'undefined' && typeof req.body.value !== 'undefined') {
            var command   = 0;
            var sign      = 0;
            var msb;
            var lsb;
            var value     = req.body.value;
            if( value < 0 ) {
                sign = 1;
                value = -value;
            }
            msb       = (value&0xFF00)>8;
            lsb       = (value&0x00FF);

            // send command via serial bluetooth
            if( req.params.name === 'leftSpeed') {
                serial.write(new Buffer([0x47, 0x01, sign, msb, lsb]), function(err, bytesWritten) {
                    if (err) {
                        console.log(err);
                    }
                });
            } else if( req.params.name === 'rightSpeed') {
                serial.write(new Buffer([0x47, 0x02, sign, msb, lsb]), function(err, bytesWritten) {
                    if (err) {
                        console.log(err);
                    }
                });
            }

            // update listeners
            robot[req.params.name] = req.body.value;
            var msg = {
                key: "emit",
                type: "robot",
                value: robot 
            };
                socket.emit('update', msg);
                res.send('new value set, message emitted', 200);
        }
        else {
            res.send('undefined: ' + req.params.name + ' or missing value key in data', 404);
        }
    });

    app.post('/robot', function(req, res) {
        if( bluetooth.connection !== state.CONNECTED) {
            res.send("bluetooth not connected", 500);
        }
        else if( typeof socket !== 'undefined') {
            var data = req.body;
            if( data.hasOwnProperty('leftSpeed') &&
                data.hasOwnProperty('rightSpeed') &&
                data.hasOwnProperty('heading') &&
                data.hasOwnProperty('battery') &&
                data.hasOwnProperty('ram') &&
                data.hasOwnProperty('servoPos') &&
                data.hasOwnProperty('distance') ) {
                robot = data;
                var msg = {
                    key: "emit",
                    type: "robot",
                    value: robot 
                };
                socket.emit('update', msg);
                res.send('new value set, message emitted', 200);
            }
            else {
                res.send('data not formatted', 500);
            }
        }
        else {
            res.send('no active socket', 500);
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
            bluetooth.connection = state.PENDING;
            var msg = {
                key: "emit",
                type: "bluetooth",
                value: bluetooth 
            };
            if( typeof socket !== 'undefined')
            {
                socket.emit('update', msg);
            }
            else {
                console.log("socket not connected");
            }
            res.send('connection on-going', 200);
        }
    });

    function onBtConnect() {
        console.log("Bluetooth Serial Port is connected");
        bluetooth.connection = state.CONNECTED;
        var msg = {
            key: "emit",
            type: "bluetooth",
            value: bluetooth 
        };
        if( typeof socket !== 'undefined')
        {
            socket.emit('update', msg);
        }
    }

    // is not implemented in node-bluetooth-serial
    serial.on('finished', function(data) {
        console.log("End of bluetooth connection");
        bluetooth.connection = 0;
        var msg = {
            key: "emit",
            type: "bluetooth",
            value: bluetooth 
        };
        if( typeof socket !== 'undefined')
        {
            socket.emit('update', msg);
        }
    });

    // this event is fired when data are received on bluetooth
    serial.on('data', function(data) {
        buffer+=data.toString();
        // looking for CRLF in received data
        var regex =  /\r\n/;
        // if buffer contains a CRLF
        if( buffer.match(regex) !== null) {
            var array = buffer.split(regex);
            try {
                var json = JSON.parse(array[0]);
                if( typeof robot[json.key] !== 'undefined') {
                    robot[json.key] = json.value;
                    var msg = {
                        key: "emit",
                        type: "robot",
                        value: robot 
                    };
                    if( typeof socket !== 'undefined')
                    {
                        socket.emit('update', msg);
                    }
                }

            } catch (e) {
//                 console.error("Parsing error of " + array[0] + " : ", e); 
            }
            // continue with the remaining part of the buffer
            buffer = array[1];
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
