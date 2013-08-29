define(
    ['Model/HeatmapRepository'],
    function(HeatmapRepo) {
        return {
            init: function(scope) {
                var placeholder = $(scope),
                    model = HeatmapRepo.getById(55);

                $(scope).find('form').on('submit', function(e) {
                    e.preventDefault();
                    $(this).find('input').each(function() {
                        model.set(this.name, $(this).val());
                    });
                });
            }
        };
    }
);
