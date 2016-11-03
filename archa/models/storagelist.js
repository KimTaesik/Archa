var mongoose = require('mongoose');

var data = mongoose.Schema({
	room_name	: { type: String, required: true, trim: true },
	send_id		: { email:String, name:String, position:String, company:String, phoneNumber:String},
	rece_id		: { email:String, name:String, position:String, company:String, phoneNumber:String},
	url			: { type: String, required: true, trim: true },
	name		: { type: String, required: true, trim: true },
	size		: { type: String },
	type		: { type: String },
	rtype		: { type: String},
	date		: Date,
});

var data = mongoose.model('data',data);

module.exports = data;
