var mongoose = require('mongoose');

var room = mongoose.Schema({
	id			: { type : String, required : true, trim : true },
	users		: [{ type : String, required: true, trim : true }],
	messagelog	: [{ mtype: String, 
					email: String, 
					name : String, 
					message : String, 
					url : String,
					og:{title: String, description: String},
					readby: [{ type: String }],
					mdate : Date }],
	roomdate	: Date
});

var room = mongoose.model('room',room);

module.exports = room;