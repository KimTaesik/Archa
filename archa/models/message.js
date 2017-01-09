var mongoose = require('mongoose');

var message = mongoose.Schema({
	mtype	: String,
	email	: String,
	name	: String,
	message : String, 
	url		: String,
	og		: {title: String, description: String},
	readby: [{ type: String }],
	mdate 	: Date
});

var message = mongoose.model('message',message);

module.exports = message;
