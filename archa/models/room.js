var mongoose = require('mongoose');

var room = mongoose.Schema({
	roomname	: { type : String, required : true, trim : true },
	users		: [{ type : String, required: true, trim : true }],
	messagelog	: [{ mtype: String, email: String, name : String, message : String, mdate : Date }],
	roomdate	: Date
});

var room = mongoose.model('room',room);

module.exports = room;