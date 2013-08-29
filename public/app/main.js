define(['jquery'], function($) {
    var widgets = [];
    $('[data-widget]').each(function() {
        var scope = this;
        require(['widget/' + $(scope).data('widget')], function(widget) {
            widget.init(scope);
        });
    });
});
