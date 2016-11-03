var mongoose = require('mongoose');

var messagelog = mongoose.Schema({
	messagelog	: [{ mtype: String, email: String, name : String, message : String, mdate : Date }]
});

var messagelog = mongoose.model('messagelog',messagelog);

module.exports = messagelog;