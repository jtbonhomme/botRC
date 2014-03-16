(function(global) {
    'use strict';

    var LeftSpeedView = Backbone.View.extend({
        el: '#lspeed',
        initialize: function () {
            this.model.on('change:leftSpeed', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            console.log(this.model); // this.model has been populated!
            var obj = this.model.attributes;
            this.el.innerHTML = obj.leftSpeed;
        }

    });

    var RightSpeedView = Backbone.View.extend({
        el: '#rspeed',
        initialize: function () {
            this.model.on('change:rightSpeed', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            console.log(this.model); // this.model has been populated!
            var obj = this.model.attributes;
            this.el.innerHTML = obj.rightSpeed;
        }

    });

    global.RightSpeedView = RightSpeedView;
    global.LeftSpeedView = LeftSpeedView;
})(this);
