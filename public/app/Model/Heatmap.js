define(['backbone'], function(Backbone) {
    var socket = io.connect('http://localhost:3000/');

    return Backbone.Model.extend({
        defaults: {
            url: ''
        },
        start: function(callback) {
            //start map
            $.getJSON('/heatmap?url=' + encodeURIComponent(this.get('url')), function(response) {
                console.log('received a message: ', response);
                callback(response);
            });
        },
        connect: function() {
            var self = this,
                currentChannel;

            $.getJSON('/channel?url=' + encodeURIComponent(this.get('url')), function(response) {
                if (currentChannel) {
                    socket.off('currentChannel');
                }

                socket.on(response.channel, function (data) {
                    console.log('received a message: ', data);
                    self.trigger('data', data);
                });
            });
        }
    });
});
