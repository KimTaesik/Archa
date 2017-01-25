var userListener = require('../models/userListener.js');
var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var DBchat = require('../DB/DBchat.js');
var DBaccount = require('../DB/DBaccount.js');
var moment = require('moment');
var Room = require('../models/room.js');
var async = require("async");

exports.chatPage = function(req, res, next){
	var user = new User;
	user = req.session.user_id;
	var room = [];
	var friends = DBchat.chatPage(user);

	friends.on('end',function(err,fds){
		if(req.session.user_id || !err){
			res.render('chat/chatPage', { title: '채팅', user: user, groups : user.groups, friends : fds, rooms: room });
		}else{
			res.redirect('/');
		}
	});
	
}

exports.joinChat = function(req,res,next){
	var name = req.body.yourName;
	res.render('chat/mid', { layout: false, yourName : name });
}

exports.inviteRoom = function(req, res, next){
	var user = new User;
	user = req.session.user_id;
	var roomUser = DBchat.getInvite(req.body.room, user);
	
	roomUser.on('end', function(err, friends, rUser){
		if(!err){
			res.render('chat/inviteUser', { layout: false, rUser: rUser, friends : friends });
		}
	});
}
exports.inviteUserSearch = function(req, res, next){
	var user = req.session.user_id;
	var search = req.body.search;
	
	var roomUser = DBchat.getInvite(req.body.room, user);
	
	roomUser.on('end', function(err, friends, rUser){
		if(!err){
			res.render('chat/inviteUserSearch', { layout: false, rUser: rUser, friends : friends, search: search });
		}
	});	
}
exports.roomInfo = function(req, res, next){
	var user = req.session.user_id;
	var room = req.body.room;
	
/*	var roomInfo = DBchat.getRoomInfo(room, user);
	roomInfo.on('end', function(err, room, users){
		if(!err){
			res.render('chat/roominfo', { layout: false, room:room, users:users});
		}
	});
	
	var evt = new EventEmitter();*/

	async.waterfall([
			function (callback) {
				var rooms = new Room;
				Room.findOne({'id': room}).exec(function(err, room){
					rooms=room;
					rooms.users.pull(user.email);
					callback(null,rooms);
					
					if(err) console.log(err);
				});
			},function(rooms, callback){
				var users = [];
				if(rooms.users.length<2){
					User.findOne({'email':rooms.users[0]}).exec(function(err, user){
						users.push(user);
						res.render('chat/roominfo', { layout: false, users:users});
					});
				}else{
					async.eachSeries(rooms.users, function (value, callback) {
	    				User.findOne({'email':value}).exec(function(err, user){
	    					if(!err && user != null){
	    						users.push(user);
	    						callback();
	    					}else{
	    						console.log(err);
	    						callback();
	    					}
	    				});
					}, function (err) {
						res.render('chat/roominfo', { layout: false, users:users});
					});
					callback(null,users);
				}
			},
			],function (err,users) {
	});
};

exports.setGroup = function(req,res,next){
	var user = new User;
	user = req.session.user_id;
	var gname = req.body.groupName;
	
	var friends = DBchat.getFriend(user, gname);
	friends.on('end', function(err, friend){
		if(!err){
			res.render('account/setFriend', { layout: false, title: '채팅', group:gname, friends : friend});
		}
	});
}

exports.addUser = function(req,res,next){
	var user = new User;
	user = req.session.user_id;
	var gname = req.body.groupName;
	
	var friends = DBchat.getFriend(user, gname);
	friends.on('end', function(err, friend){
		if(!err){
			res.render('account/addFriend', { layout: false, title: '채팅', group:gname, friends : friend});
		}
	});
}

exports.addGroup = function(req, res, next){
	var user = new User;
	user=req.session.user_id;
	var gname = req.body.groupName;
	
	var group = DBchat.addGroup(user, gname);
	group.on('end',function(err,me){
		if(!err){
			var friend = DBaccount.leftmenu(me);
			friend.on('end', function(err, friend){
				req.session.user_id = me;
				res.render('account/friend', { layout: false, title: '채팅', user: me, groups:me.groups, friends: friend });				
			});
		}
	});
	
}
exports.groupOut = function(req, res, next){
	var user = new User;
	user = req.session.user_id;
	var gname = req.body.groupName;
	var friend = req.body.email;
	var group = DBchat.groupOut(user, friend, gname);
	group.on('end', function(err,me, friend){
		if(!err){
			res.render('account/friend', { layout: false, title: '채팅', user: me, groups:me.groups, friends: friend });
		}
	})
}
exports.addChkUser = function(req, res, next){
	var user = new User;
	user = req.session.user_id;
	var gname = req.body.groupName;
	var friends = new Array();
	friends.push(req.body.ids);
	
	var group = DBchat.addChkUser(user, friends, gname);
	group.on('end', function(err,me, friend){
		if(!err){
			res.render('account/friend', { layout: false, title: '채팅', user: me, groups:me.groups, friends: friend });
		}
	});
}
exports.deleteGroup = function(req, res, next){
	var user = new User;
	user=req.session.user_id;
	var gname = req.body.groupName;
	
	var group = DBchat.deleteGroup(user, gname);
	group.on('end',function(err,me){
		if(!err){
			var friend = DBaccount.leftmenu(me);
			friend.on('end', function(err, friend){
				req.session.user_id = me;
				res.render('account/friend', { layout: false, title: '채팅', user: me, groups:me.groups, friends: friend });				
			});
		}
	});
	
}