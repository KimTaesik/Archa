var mongoose = require('mongoose');

var message = mongoose.Schema({
	mtype	: String,
	email	: String,
	name	: String,
	message : String, 
	mdate 	: Date
});

var message = mongoose.model('message',message);

module.exports = message;
