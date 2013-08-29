define(
    ['heatmap', 'Model/HeatmapRepository'],
    function(h337, HeatmapRepo) {
        function createMap(scope) {
            return h337.create({
                element: scope,
                radius: 5,
                opacity: 50,
                legend: {
                    position: 'br',
                    title: 'Clicks'
                }
            });
        }

        return {
            init: function(scope) {
                var placeholder = $(scope),
                    model = HeatmapRepo.getById(55),
                    heatmap;

                placeholder.css({
                    'width': $(window).width(),
                    'height': $(window).height(),
                    'background-color' : 'grey'
                });

                model
                    .on('data', function(data) {
                        heatmap.store.addDataPoint(data.pos.x, data.pos.y, 1);
                    })
                    .on('change:url', function() {
                        if (heatmap) {
                            heatmap.clear();
                            heatmap.cleanup();
                        }
                        heatmap = createMap(scope);
                        this.start(function(response) {
                            for (var i in response) {
                                if (response.hasOwnProperty(i)) {
                                    var data = response[i];
                                    heatmap.store.addDataPoint(data.pos.x, data.pos.y, 1);
                                }
                            }
                        });
                        this.connect();
                    })
                    .set('url', 'http://localhost:3000/index.html?asdffdf=33');

                placeholder.show();
            }
        };
    }
);
