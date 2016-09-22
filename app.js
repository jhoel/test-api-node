var express  = require("express"),
    app      = express(),
    http     = require("http"),
    server   = http.createServer(app),
    mongoose = require('mongoose'); 

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get('/', function(req, res) {
  res.send("Hello world!");
});

app.use(express.static(__dirname + '/public'));

routes = require('./routes/users')(app);
routes = require('./routes/transferences')(app);
                           
mongoose.connect('mongodb://localhost/users', function(err, res) {
	if(err) {
		console.log('ERROR: connecting to Database. ' + err);
	} else {
		console.log('Connected to Database');
	}
});

server.listen(4000, function() {
  console.log("Node server running on http://localhost:4000");
});