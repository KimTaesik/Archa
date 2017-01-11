var userListener = require('../models/userListener.js');
var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var DBchat = require('../DB/DBchat.js');
var DBaccount = require('../DB/DBaccount.js');
var moment = require('moment');

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

/*mid 페이지 모달 데이터*/
exports.chatlist = function(req, res, next){
	var user = new User;
	user = req.session.user_id;
	var room = [];
	var friends = DBchat.chatPage(user);

	friends.on('end',function(err,fds){
		if(req.session.user_id || !err){
			console.log(fds);
			res.render('chat/chatlist', { title: '채팅', user: user, groups : user.groups, friends : fds, rooms: room });
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