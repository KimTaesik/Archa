var userListener = require('../models/userListener.js');
var User = require('../models/user.js');
var Friend = require('../models/friend.js');

exports.myAllFriend = function(req, res, next){
	var user = new User;
	user = eq.session.user_id;
	var fds = new Friend;

	User.
	  findOne({email : user.email})
	  .populate({
	    path: 'friends'})
	  .exec(function (err, fd) {
		  	fds = fd.friends;
		  	return fds;
	  });
}