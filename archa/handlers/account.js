var userListener = require('../models/userListener.js');
var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var DBaccount = require('../DB/DBaccount.js');
var async = require("async");
var moment = require('moment');
moment.locale('ko');

exports.login = function(req, res, next){
	var email = req.body.eMail;
	var password = req.body.password;
	
	var checkUser = DBaccount.login(req.body.eMail, req.body.password);
	checkUser.on('end',function(err,user){
		if(!err && user != null){
			req.session.user_id = user;
			res.redirect('/chatPage');
		}else{
			res.redirect('/');
		}
	});
}

exports.friendInfo = function(req, res, next){
	var friendEmail = req.body.friend;
	
	User.findOne({'email' : friendEmail }).exec(function(err, user){
		if(!err){
			res.render('account/friendinfo',{ layout:false ,moment:moment, user: user});
		}
	});
	
}

exports.logout = function(req, res, next){
	req.session.destroy(function(){
		res.redirect('/');
	});
}

exports.mypage = function(req, res, next){
	var user = req.session.user_id;
	res.render('account/mypage',{ layout:false ,user:user});	
}

exports.leftmenu = function(req, res, next){
	var user = new User;
	var user = req.session.user_id;
	
	var friend = DBaccount.leftmenu(user);
	friend.on('end', function(err,fds){
		if(!err){
			res.render('account/leftmenu',{ layout:false ,user: user, groups:user.groups, friends: fds});
		}
	});
	

}

exports.userReg = function(req, res, next){
	res.render('account/userReg', { title: '회원등록' });
}

exports.register = function(req, res, next){
	var email = req.body.eMail;
	var name = req.body.name;
	var password = req.body.password;
	var company = req.body.company;
	var position = req.body.position;
	var phoneNumber = req.body.phoneNumber;
	
	var user = new User({
		'email':email,
		'password':password,
		'name':name,
		'company':company,
		'position':position,
		'phoneNumber':phoneNumber,
		'signDate' : new Date,
		'groups' : 'default'
	});
	
	var save = DBaccount.register(user);
	save.on('end', function(err,result){
		res.redirect('/');
	});

}


exports.updateMyInfo = function(req, res, next){
	var email = req.session.user_id.email;
	var company = req.body.myCompany;
	var position = req.body.position;
	var phoneNumber = req.body.phoneNumber;
//	var user = req.session.user_id;
	var update = DBaccount.updateMyInfo(email, company, position, phoneNumber);
	
	update.on('end',function(err,user,fds){
		if(!err && user){
			req.session.user_id = user;
			console.log(user);
			res.render('account/leftmenu',{ layout:false ,user: user, groups: user.groups, friends: fds});
		}else{
			res.redirect('/chatPage');
		}		
	});
}
exports.getFriend = function(req, res, next){
	var user = req.session.user_id;
	var getFriend = DBaccount.getFriend(user);
	getFriend.on('end', function(err, fds){
		if(!err){
			res.render('account/friend', { layout: false, title: '채팅', user: user, groups:user.groups, friends: fds });
		}
	});
}

exports.signOutUser = function(req, res, next){	
	var result = DBaccount.signOutUser(req.session.user_id.email, req.body.password);
	result.on('end',function(err,result){
		if(!err && result=='success'){
			req.session.destroy(function(){
				res.redirect('/');
			});
		}
	});
}
exports.allUser = function(req, res, next){
	var input = req.body.inputAll;
	var checkUser = DBaccount.allUser(input);
	checkUser.on('end', function(err,user){
		if(err) throw err;
		console.log(user);
		res.render('account/friend2',{ layout:false ,friends:user});
	});
}
exports.searchFriend = function(req, res, next){
	
	var user = new User;
	user = req.session.user_id;

	var friends = DBaccount.searchFriend(user, req.body.inputSearchMember);
	friends.on('end',function(err,fds){
		if(!err && fds[0].friend!=null){
			res.render('account/friend', { layout: false, title: '채팅', user: user, groups:user.groups, friends: fds });
		}else{
			res.send('검색결과가 없다');
		}
	});
	
}
exports.addFriend = function(req, res, next){
	var user = new User;
	user=req.session.user_id;
	var friend = req.body.email;
	
	var friends = DBaccount.addFriend(user,friend);
	friends.on('end',function(err,user,friend){
		req.session.user_id = user;
		res.render('account/friend', { layout: false, title: '채팅', user: user, groups:user.groups, friends: friend });
	});
	
}


exports.deleteFriend = function(req, res, next){
	var user = new User;
	user=req.session.user_id;
	var friend = req.body.friend;
	
	var delFriend = DBaccount.deleteFriend(user , friend);
	delFriend.on('end',function(err,user,friend){
		if(err) throw err;
		req.session.user_id = user;
		res.render('account/friend', { layout: false, title: '채팅', user: user, groups:user.groups, friends: friend });
	});	
	
}

