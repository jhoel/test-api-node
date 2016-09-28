var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: 	{ type: String },
	password: 	{ type: String },
	firstname: 	{ type: String },
	lastname: 	{ type: String }, 
	creditAccounts: { type: [String] },
	debitAccounts: { type: [String] } 
});

module.exports = mongoose.model('User', UserSchema);
