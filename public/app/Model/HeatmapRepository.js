define(
    ['Model/Repository', 'Model/Heatmap'],
    function(Repository, Heatmap) {
        return new (Repository.extend({
            model: Heatmap,
            url: "/heatmap/"
        }));
    }
);