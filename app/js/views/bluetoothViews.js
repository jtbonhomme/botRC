(function(global) {
    'use strict';

    global.state = {
        NOT_CONNECTED: 0,
        PENDING:       1,
        CONNECTED:     2
    };

    var BluetoothView = Backbone.View.extend({
        el: '#bluetooth',
        initialize: function () {
            this.model.on('change:connection', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
        },
        render: function () {
            console.log(this.model); // this.model has been populated!
            var obj = this.model.attributes;
            if( obj.connection === global.state.NOT_CONNECTED) {
                this.el.innerHTML = "BLUETOOTH NOT CONNECTED";
                this.el.style.color = "#e05050";
            }
            else if( obj.connection === global.state.PENDING) {
                this.el.innerHTML = "BLUETOOTH CONNECTION PENDING";
                this.el.style.color = "#5050e0";
            }
            else if( obj.connection === global.state.CONNECTED) {
                this.el.innerHTML = "BLUETOOTH CONNECTED";
                this.el.style.color = "#50e050";
            }
        }

    });

    global.BluetoothView = BluetoothView;

})(this);
