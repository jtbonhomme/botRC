(function(global) {
    'use strict';

    var BatteryView = Backbone.View.extend({
        //el: '#battery',
        initialize: function () {
            this.model.on('change:battery', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            console.log(this.model); // this.model has been populated!
            var obj = this.model.attributes;
            //this.el.innerHTML = obj.battery;
            var $el = $(".battery");
            var percent = Math.round(obj.battery/4000*100);
            $el.val(percent).trigger("change");
        }

    });

    var RamView = Backbone.View.extend({
        //el: '#ram',
        initialize: function () {
            this.model.on('change:ram', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            console.log(this.model); // this.model has been populated!
            var obj = this.model.attributes;
            //this.el.innerHTML = obj.ram;
            var $el = $(".ram");
            var percent = Math.round(obj.ram/2/1024*100);
            $el.val(percent).trigger("change");
        }

    });

    global.BatteryView = BatteryView;
    global.RamView = RamView;
})(this);
