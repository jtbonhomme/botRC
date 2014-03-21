(function(global) {
    'use strict';

    var LeftSpeedView = Backbone.View.extend({
        initialize: function () {
            this.model.on('change:leftSpeed', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            var obj = this.model.attributes;
            var $el = $("#lspeed");
            $el.val(obj.leftSpeed).trigger("change");
        }

    });

    var RightSpeedView = Backbone.View.extend({
        initialize: function () {
            this.model.on('change:rightSpeed', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            var obj = this.model.attributes;
            var $el = $("#rspeed");
            $el.val(obj.rightSpeed).trigger("change");
        }

    });

    global.RightSpeedView = RightSpeedView;
    global.LeftSpeedView = LeftSpeedView;

})(this);
