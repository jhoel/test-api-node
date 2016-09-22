//File: routes/tvshows.js
module.exports = function(app) {

  var Transference = require('../models/transference.js');

  //GET - Return all transferences in the DB
  findAllTransferences = function(req, res) {
  	Transference.find(function(err, transferences) {
  		if(!err) {
	        console.log('GET /transferences')
  			res.send(transferences);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };


  //Link routes and functions
  app.get('/transferences', findAllTransferences);
  
} 