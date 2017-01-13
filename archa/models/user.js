var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	user_img	: String,
	email		: { type: String, required: true, unique : true},
	password	: { type: String, required: true},
	name		: { type: String, required: true, trim: true },
	company		: { type: String, required: true, trim: true },
	position	: { type: String, required: true, trim: true },
	phoneNumber	: { type: String, required: true, trim: true },
	signDate 	: Date,
	roomName	: [{ roomId: String, rName: String, "_id": false }],
	groups		: [{ type: String, unique : true }],
	request		: [{ email : String, name: String, company: String, position: String, "_id": false }],
/*	request		: [{ type : mongoose.Schema.Types.ObjectId, require : true, ref : 'user', "_id": false }],*/
	history		: [{ name : String, notidate : Date }],
	friends		: [{ friend :{ type : mongoose.Schema.Types.ObjectId, require : true, ref : 'user' }, groupname:{ type:String, required:true, "default":'default' }, "_id": false }],
	state		: { type: Number, "default": 0},
	summary		: String,
	exp			: [{ position: String, company: String, start: Date, end: Date, contents: String}]
});

var user = mongoose.model('user', userSchema);

module.exports = user;