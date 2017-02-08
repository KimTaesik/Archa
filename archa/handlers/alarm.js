var User = require('../models/user.js');
var Data = require('../models/storagelist.js');
var moment = require('moment');
moment.locale('ko');

exports.alarm = function(req,res,next){
	var me = req.session.user_id.email;
	User.findOne({'email':me}).exec(function(err,user){
		res.render('alarm/alarmAll', { layout: false, req : user.request, his : user.history});
	});
	
}
/*
 * 친구신청(relation connect)
 */
exports.findRelationUser = function(req, res, next){
	var input = req.body.search;
	var term = new RegExp(input, 'i');
	var sessionUser = req.session.user_id;
	var me = sessionUser.email;
	User.find().or([{ email: { $regex: term }}, 
	                { name: { $regex: term }}, 
	                { company: { $regex: term }}, 
	                { position: { $regex: term }}, 
	                { phoneNumber: { $regex: term }}]).
	                exec(function(err,user){
	                	if(!err) res.render('alarm/result', { layout:false , friends:user, user:sessionUser, me : me});
	            	});
};
/*
 * connect 수락
 */
exports.connFriend = function(req, res, next){
	var user = new User;
	user = req.session.user_id;
	var you = req.body.friendId;
	
	User.findOneAndUpdate({'email': you },{$addToSet:{'history':  { 'email':user.email, 'name' :user.name , 'notidate': new Date } , 'friends': { 'friend' : user._id  }}},{upsert: true, 'new': true}).exec(function(err,friend){
		User.findOneAndUpdate({'email': user.email}, {$addToSet:{'history':  { 'email':friend.email, 'name' :friend.name , 'notidate': new Date } , 'friends': { 'friend' : friend._id  }}, $pull:{'request':{'email':you}}},{upsert: true, 'new': true})
			.populate({
				path	: 'friends.friend'
			}).exec(function(err, doc){
				req.session.user_id = doc;
				res.render('account/friend', { layout: false, title: '채팅', user: doc, groups:doc.groups, friends: doc.friends });
		});
	});
}
exports.findRelation = function(req, res, next){
	res.render('alarm/findRelation', {layout:false});
};

exports.tabReq = function(req, res, next){
	var me = req.session.user_id.email;
	User.findOne({'email':me}).exec(function(err,user){
		res.render('alarm/request', { layout: false, req : user.request, his : user.history});
	});
};

exports.tabNoti = function(req, res, next){
	var me = req.session.user_id.email;
	User.findOne({'email':me}).exec(function(err,user){
		res.render('alarm/notification', { layout: false, req : user.request, his : user.history});
	});
};