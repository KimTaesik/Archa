var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	email		: { type: String, required: true, unique : true},
	password	: { type: String, required: true},
	name		: { type: String, required: true, trim: true },
	company		: { type: String, required: true, trim: true },
	position	: { type: String, required: true, trim: true },
	phoneNumber	: { type: String, required: true, trim: true },
	signDate 	: Date,
	friends		: [{ type : mongoose.Schema.Types.ObjectId , ref: 'user', unique : true }],
	accessToken	: { type: String } // Used for Remember Me
});

var user = mongoose.model('user', userSchema);

module.exports = user;