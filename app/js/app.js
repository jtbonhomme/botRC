// mincer directives processor are listed bellow
//= require_tree views

(function(global) {
    'use strict';

    var RobotModel = Backbone.Model.extend({url: 'http://localhost:3000/robot'});

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
          $.post( this.model.url + '/leftSpeed', { 'value': 0 } );
          $.post( this.model.url + '/rightSpeed', { 'value': 0 } );
        },
        render: function () {
            console.log(this.model); // this.model has been populated!
            var obj = this.model.attributes;
            this.el.innerHTML = "";
            this.el.innerHTML += "battery    : " + obj.battery + "<br>";
            this.el.innerHTML += "ram        : " + obj.ram + "<br>";
            this.el.innerHTML += "heading    : " + obj.heading + "<br>";
            this.el.innerHTML += "servoPos   : " + obj.servoPos + "<br>";
            this.el.innerHTML += "distance   : " + obj.distance + "<br>";
        }

    });

    var socket = io.connect('http://localhost');
    var robotModel = new RobotModel();
    var robotView = new RobotView({ model: robotModel });
    var lspeedView = new global.LeftSpeedView({ model: robotModel });
    var rspeedView = new global.RightSpeedView({ model: robotModel });

    socket.on('update', function (data) {
      console.log('received update : %o ', data);
      robotModel.fetch(); // fetch the model from url on socket notification
    });


})(this);
