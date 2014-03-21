// mincer directives processor are listed bellow
//= require_tree libs
//= require_tree views

(function(global) {
    'use strict';

    var RobotModel = Backbone.Model.extend({url: 'http://localhost:3000/robot'});
    var BluetoothModel = Backbone.Model.extend({url: 'http://localhost:3000/bluetooth'});

    var RobotView = Backbone.View.extend({
        el: 'document',
        leftSpeed:  0,
        rightSpeed: 0,
        events: {
            'keydown': 'this.onKeydown',
            'keyup':   'this.onKeyup'
        },
        initialize: function () {
            $(document).on('keydown', this.onKeydown);
            $(document).on('keyup', this.onKeyup);
            this.model.on('change', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        onKeydown: function(event) {
            switch(event.keyCode) {
                case 38: // up
                    this.leftSpeed += 50;
                    this.rightSpeed += 50;
                    break;
                case 40: // down
                    this.leftSpeed -= 50;
                    this.rightSpeed -= 50;
                    break;
                case 37: // left
                    this.leftSpeed -= 50;
                    this.rightSpeed += 50;
                    break;
                case 39: // right
                    this.leftSpeed += 50;
                    this.rightSpeed -= 50;
                    break;
            }
            $.post( '/robot/leftSpeed', { 'value': this.leftSpeed } );
            $.post( '/robot/rightSpeed', { 'value': this.rightSpeed } );
        },
        onKeyup: function(event) {
            this.leftSpeed =  0;
            this.rightSpeed = 0;
            $.post( '/robot/leftSpeed', { 'value': this.leftSpeed } );
            $.post( '/robot/rightSpeed', { 'value': this.rightSpeed } );
        },
        render: function () {
            var obj = this.model.attributes;
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
    var headingView = new global.HeadingView({ model: robotModel });
    var ramView = new global.RamView({ model: robotModel });
    var batteryView = new global.BatteryView({ model: robotModel });
    var distanceView = new global.DistanceView({ model: robotModel });

    // create bluetooth view
    var bluetoothView = new global.BluetoothView({ model: bluetoothModel });

    // wait for updates
    socket.on('update', function (data) {
        if( data.type === "bluetooth") {
            bluetoothModel.fetch(); // fetch the model from url on socket notification
        }
        else if( data.type === "robot") {
            robotModel.fetch(); // fetch the model from url on socket notification
        }
    });

})(this);
