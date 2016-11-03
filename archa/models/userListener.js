var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	email: String,
	password: String,
	name: String,
	company: String,
	position: String,
	phonenumber: String,
	signDate : Date
});

var userListener = mongoose.model('userListener',userSchema);

module.exports = userListener;
