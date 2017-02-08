var mongoose = require('mongoose');

var request = mongoose.Schema({
	email : String, 
	name: String, 
	company: String, 
	position: String,
	"_id": false
});

var request = mongoose.model('request', request);

module.exports = request;