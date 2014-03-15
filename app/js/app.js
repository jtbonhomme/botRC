// mincer directives processor are listed bellow
//= require_tree views

(function(global) {
    'use strict';

    var RobotModel = Backbone.Model.extend({url: 'http://localhost:3000/robot'});
    var BluetoothModel = Backbone.Model.extend({url: 'http://localhost:3000/bluetooth'});

    var RobotView = Backbone.View.extend({
        el: '#robot',
        initialize: function () {
            $(document).on('keydown', this.keydown);
            $(document).on('keyup', this.keyup);
            this.model.on('change', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        keydown: function(event) {
            console.log('keydown');
        },
        keyup: function(event) {
          console.log('keyup');
          $.post( '/robot/leftSpeed', { 'value': 0 } );
          $.post( '/robot/rightSpeed', { 'value': 0 } );
        },
        render: function () {
            console.log(this.model); // this.model has been populated!
            var obj = this.model.attributes;
            this.el.innerHTML = "";
            this.el.innerHTML += "heading    : " + obj.heading + "<br>";
            this.el.innerHTML += "servoPos   : " + obj.servoPos + "<br>";
            this.el.innerHTML += "distance   : " + obj.distance + "<br>";
        }

    });

    // initialize socket
    var socket = io.connect('http://localhost');

    // create models
    var robotModel = new RobotModel();
    var bluetoothModel = new BluetoothModel();

    // create robot views (all views share the same model)
    var robotView = new RobotView({ model: robotModel });
    var lspeedView = new global.LeftSpeedView({ model: robotModel });
    var rspeedView = new global.RightSpeedView({ model: robotModel });
    var ramView = new global.RamView({ model: robotModel });
    var batteryView = new global.BatteryView({ model: robotModel });

    // create bluetooth view
    var bluetoothView = new global.BluetoothView({ model: bluetoothModel });

    // wait for updates
    socket.on('update', function (data) {
        console.log('received update : %o ', data);
        if( data.type === "bluetooth") {
            bluetoothModel.fetch(); // fetch the model from url on socket notification
        }
        else if( data.type === "robot") {
            robotModel.fetch(); // fetch the model from url on socket notification
        }
    });

})(this);
