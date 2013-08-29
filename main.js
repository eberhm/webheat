var express = require('express'),
    http = require('http'),
    MongoClient = require('mongodb').MongoClient,
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    events = require('events'),
    sandbox = new events.EventEmitter,
    crypto = require('crypto'),
    webshot = require('webshot');

//webshot('google.com', 'google.png', function(err) {
//    // screenshot now saved to google.png
//});

const PORT = 3000;

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    var collection = db.collection('test_webheat');
    if(err) throw err;

    //pixel request
    app.get('/pixel', function(req, res, error) {
        //save data into db
        var data = {
            pos: {
                x: req.param('x'),
                y: req.param('y')
            },
            url: req.param('url')
        };
        collection.insert(data, function() {
            sandbox.emit('insert', data);
        });

        res.set({
            'Pragma': 'no-cache',
//            Expires: Wed, 19 Apr 2000 11:43:00 GMT
//            Last-Modified: Wed, 21 Jan 2004 19:51:30 GMT
            'Content-Type': 'image/gif',
            'Content-Length': 1,
            'Cache-Control': 'private, no-cache, no-cache=Set-Cookie, proxy-revalidate'
        });
        res.status(200).send({});
        console.log(data);
    });

    app.get('/heatmap', function(req, res, error) {
        var url = req.param('url');
        console.log('heatmap requested with url: ' + url);
        collection.find({url: url}).toArray(function(err, items) {
            res.json(items);
        });
    });

    io.sockets.on('connection', function(socket) {
        console.log('registering insert event');
        sandbox.on('insert', function(data) {
            console.log('received insert event');
            socket.emit(getChannel(data.url), data);
        });
    });
});

//main client entry point
app.get('/channel', function(req, res, error) {
    console.log('url for channel ' + req.param('url'));
    res.json({channel: getChannel(req.param('url'))});
});

app.use("/", express.static('public'));

server.listen(PORT);
console.log("Webmap app started and listening in port %s", PORT);

function getChannel(url) {
    var md5 = crypto.createHash('md5');
    console.log('getting channel for ' + url);
    var digest = md5.update(url).digest('hex');
    console.log('url md5 --->' + digest);
    return  digest;
}
