var userListener = require('../models/userListener.js');
var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var Room = require('../models/room.js');


exports.roomlist = function(req, res, next){
	var user = new User;
	user = req.session.user_id;
	console.log('룸 진입');
	console.log(user);
	
	Room
	.find({users:user.email}, 'roomname')
	.exec(function (err, room) {
		console.log('룸 파인드 진ㅇ닙');
		if(err) console.log(err);
		console.log(room[0]);
		res.render('account/room',{ layout:false ,rooms:room});
	});	
}