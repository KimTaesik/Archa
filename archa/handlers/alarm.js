var User = require('../models/user.js');
var Data = require('../models/storagelist.js');
var moment = require('moment');
moment.locale('ko');

exports.alarm = function(req,res,next){
	var me = req.session.user_id.email;
	User.findOne({'email':me}).exec(function(err,user){
		console.log(user.request);
		res.render('alarm/alarmAll', { layout: false, req : user.request, his : user.history});
	});
	
}
exports.findRelationUser = function(req, res, next){
	var input = req.body.search;
	console.log(input);
	var term = new RegExp(input, 'i');
	User.find().or([{ email: { $regex: term }}, 
	                { name: { $regex: term }}, 
	                { company: { $regex: term }}, 
	                { position: { $regex: term }}, 
	                { phoneNumber: { $regex: term }}]).
	                exec(function(err,user){
	                	if(err) console.log(err);
	                	else console.log(user);
	                	
	                	res.render('alarm/result', { layout:false , friends:user});
	            	});
};

exports.findRelation = function(req, res, next){
	res.render('alarm/findRelation', {layout:false});
};

exports.tabReq = function(req, res, next){
	res.render('alarm/findRelation', {layout:false});
};

exports.tabNoti = function(req, res, next){
	res.render('alarm/findRelation', {layout:false});
};