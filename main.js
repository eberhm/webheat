var express = require('express'),
    MongoClient = require('mongodb').MongoClient,
    app = express();

//const HOST = 'localhost';
const PORT = 3000;
const io = require('socket.io').listen(app);


MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    var collection = db.collection('test_webheat');
    if(err) throw err;

    //pixel request
    app.get('/pixel/\?x=:x&y=:y&url=:url', function(req, res, error) {
        //save data into db
        var data = {
            pos: {
                x: req.param('x'),
                y: req.param('y')
            },
            url: req.param('url')
        };
        collection.insert(data, function() {});

        res.status(200).sendfile('resources/img/logo_e.jpg');
        console.log(data);
    });

    io.sockets.on('connection', function(socket) {
        collection.on('insert', function(data) {
            socket.emit('data', data);
        });
    });
});

//main client entry point
app.get('/heatmap/\?url=:url', function(req, res, error) {
    res.contentType('text/html');
    res.status(200).sendfile('public/index.html');
});

app.use("/", express.static('public'));

app.listen(PORT);
console.log("Estoy oyendo por express en la la direccion %s y mi directorio es %s", app.address, __dirname);