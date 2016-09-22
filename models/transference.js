var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var TransferenceSchema = new Schema({
	accountFrom: 	{ type: String },
	accountTo: 		{ type: String },
	importe: 		{ type: Number },
	reference: 		{ type: String },
	date: 			{ type: Date, default: Date.now },
	username:  		{ type: String } 		
});

module.exports = mongoose.model('Transference', TransferenceSchema);
