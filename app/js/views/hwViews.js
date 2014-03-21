(function(global) {
    'use strict';

    var BatteryView = Backbone.View.extend({
        initialize: function () {
            this.model.on('change:battery', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            var obj = this.model.attributes;
            var $el = $(".battery");
            var percent = Math.round(obj.battery/4000*100);
            $el.val(percent).trigger("change");
        }
    });

    var RamView = Backbone.View.extend({
        initialize: function () {
            this.model.on('change:ram', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            var obj = this.model.attributes;
            var $el = $(".ram");
            var percent = Math.round(obj.ram/2/1024*100);
            $el.val(percent).trigger("change");
        }
    });


    var HeadingView = Backbone.View.extend({
        initialize: function () {
            this.model.on('change:heading', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            var obj = this.model.attributes;
            var $el = $(".heading");
            $el.val(obj.heading).trigger("change");
        }
    });


    var DistanceView = Backbone.View.extend({
        el: '#distance',
        initialize: function () {
            this.model.on('change', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            var obj = this.model.attributes;
            this.el.value = obj.distance;
        }
    });

    global.HeadingView = HeadingView;
    global.BatteryView = BatteryView;
    global.RamView = RamView;
    global.DistanceView = DistanceView;

})(this);
