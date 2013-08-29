define(
    ['backbone'],
    function(Backbone) {
        return Backbone.Collection.extend({
            getById: function(id) {
                return this.get(id) || (this.add({id:id}), this.get({id:id}));
            }
        });
    }
);
