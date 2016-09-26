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

app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
  });

app.all("*", function(req, res, next) {
  if (req.method.toLowerCase() !== "options") {
    return next();
  }
  return res.send(204);
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