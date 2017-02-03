var userListener = require('../models/userListener.js');
var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var DBaccount = require('../DB/DBaccount.js');
var formidable = require('formidable');
var fs = require('fs');
var async = require("async");
var moment = require('moment');
moment.locale('ko');

exports.login = function(req, res, next){
	var email = req.body.eMail;
	var password = req.body.password;
	
	//로그인, 유저의 정보를 가져와 세션에 주입.
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
exports.profileEdit = function(req, res, next){
	var category = req.body.category;
	var input = req.body.input;
	var nowPwd = req.body.pwd;
	var user = req.session.user_id;
	if(category == 'signOut'){
		
	}else{
		User.findOne({'email': user.email}).exec(function(err,user){
			if(category == 'updateCom'){
				user.company = input;
				req.session.user_id = user;
				user.save(function(err){
					if(!err){
						res.render('account/profile',{ layout:false, title:'Profile', user:user, perr:0 });
					}
				});
			}else if(category == 'updateTitle'){
				user.position = input;
				req.session.user_id = user;
				user.save(function(err){
					if(!err){
						res.render('account/profile',{ layout:false, title:'Profile', user:user, perr:0 });
					}
				});
			}else if(category == 'updatePh'){
				user.phoneNumber = input;
				req.session.user_id = user;
				user.save(function(err){
					if(!err){
						res.render('account/profile',{ layout:false, title:'Profile', user:user, perr:0 });
					}
				});
			}else if(category == 'updatePwd'){
				if(user.password == nowPwd){
					user.password = input;
					user.save(function(err){
						if(!err){
							res.render('account/profile',{ layout:false, title:'Profile', user:user, perr:0 });
						}
					});
				}else{
					res.render('account/profile',{ layout:false, title:'Profile', user:user, perr:1  });
				}
			}
		});		
	}

	
}
exports.profile = function(req, res, next){
	var user = req.session.user_id;
	User.findOne({'email':user.email}).exec(function(err, user){
		if(err) console.log(err)
		else res.render('account/profile',{ layout:false, title:'Profile', user:user, perr:0 });
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
exports.userProfileImg = function(req, res, next){
	var user = req.session.user_id;
	var form = new formidable.IncomingForm();

	form.parse(req, function(req, fields, files){
		
		User.findOne({'email':user.email}).exec(function(err, user){
			user.user_img.data = fs.readFileSync(files.userfile.path);
			user.user_img.contentType = 'image/png';
			user.save(function(err, user_img){
				if(err) console.log(err);
				var base = (new Buffer(user_img.user_img.data)).toString('base64');
				res.send(base);
				
			});
		});
		
	});	
}
exports.logout = function(req, res, next){
	req.session.destroy(function(){
		var email = req.session.user_id.email;
		User.findOneAndUpdate({'email':email}, { $set:{'state' : 0 }},{upsert: true, 'new': true})
		.exec(function(err, user){
			res.redirect('/');
		});
		
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
	var search = req.body.inputSearchMember;
	var friends = DBaccount.getFriend(user);
	friends.on('end',function(err,fds){
		if(!err && fds[0].friend!=null){
			res.render('account/friend', { layout: false, title: '채팅', user: user, groups:user.groups, friends: fds, search:search });
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

/* chatlist  2016_12_01 */
exports.chatlist = function(req, res, next){

	var user = req.session.user_id;
	var friends = DBchat.chatPage(user);
	friends.on('end', function(err, fds){
		if(!err){
			res.render('account/chatlist', { layout: false, title: '채팅', user: user, groups:user.groups, friends: fds });
		}
	});
}

/*
 * 상세 profile summary 임시
 */
exports.summary = function(req, res, next){
	var email;

	User.
	findOneAndUpdate({'email': email},
						{ $set : { 'summary' : summary } },
						{upsert: true, 'new': true}
	).
	populate({
			path	: 'friends.friend', options: { sort: { 'name': 1 }} 
	}).
	exec(function(err, doc){
		req.session.user_id = doc;
	});
}
/*
 * 상세 profile exp 임시
 */
exports.exp = function(req, res, next){
	User.
	findOneAndUpdate({'email': email}, 
						{$addToset:
							{'exp':
								{
									'position'	:position, 
									'company'	:company,
									'start'		:start,
									'end'		:end,
									'contents'	:contents
								}
							}
						},{upsert: true, 'new': true}
	).
	populate({
				path	: 'friends.friend', options: { sort: { 'name': 1 }} 
	}).
	exec(function(err, doc){
		req.session.user_id = doc;
	});
}
/*
 * 상세 profile exp 삭제 임시
 */
exports.deleteExp = function(req, res, next){
	User.
	findOneAndUpdate({'email': email}, 
						{$pull:
							{'exp':
								{
									'position'	:position, 
									'company'	:company,
									'start'		:start,
									'end'		:end
								}
							}
						},{upsert: true, 'new': true}
	).
	populate({
				path	: 'friends.friend', options: { sort: { 'name': 1 }} 
	}).
	exec(function(err, doc){
		req.session.user_id = doc;
	});	
	
}