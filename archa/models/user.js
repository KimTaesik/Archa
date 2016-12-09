var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	email		: { type: String, required: true, unique : true},
	password	: { type: String, required: true},
	name		: { type: String, required: true, trim: true },
	company		: { type: String, required: true, trim: true },
	position	: { type: String, required: true, trim: true },
	phoneNumber	: { type: String, required: true, trim: true },
	signDate 	: Date,
	roomName	: [{ roomId: String, rName: String }],
	groups		: [{ type: String, unique : true }],
	request		: [{ type: String }],
	history		: [{ email : String, notidate : Date }],
	friends		: [{ friend :{ type : mongoose.Schema.Types.ObjectId, require : true, ref : 'user' }, groupname:{ type:String, required:true, "default":'default' }, "_id": false }]
});

var user = mongoose.model('user', userSchema);

module.exports = user;