(function(global) {
    'use strict';

    global.state = {
        NOT_CONNECTED: 0,
        PENDING:       1,
        CONNECTED:     2
    };

    var BluetoothView = Backbone.View.extend({
        el: '#bluetooth',
        isConnected: false,
        initialize: function () {
            this.model.on('change:connection', this.render, this); // attempt to bind to model change event
            this.model.fetch(); // fetching the model data from url
            $('#connect').click(this.onClickConnect);
        },
        render: function () {
            var obj = this.model.attributes;
            if( obj.connection === global.state.NOT_CONNECTED) {
                this.el.innerHTML = "BLUETOOTH NOT CONNECTED";
                this.el.style.color = "#e05050";
                this.isConnected = false;
            }
            else if( obj.connection === global.state.PENDING) {
                this.el.innerHTML = "BLUETOOTH CONNECTION PENDING";
                this.el.style.color = "#5050e0";
                this.isConnected = false;
            }
            else if( obj.connection === global.state.CONNECTED) {
                this.el.innerHTML = "BLUETOOTH CONNECTED";
                this.el.style.color = "#50e050";
                this.isConnected = true;
            }
        },
        onClickConnect: function(){
            console.log("+++ connect +++");
            if(this.isConnected === global.state.NOT_CONNECTED) {
                $.post('/bluetooth', {'address': '20-13-05-07-38-71', 'channel': 1});
            }
        }
    });

    global.BluetoothView = BluetoothView;

})(this);
