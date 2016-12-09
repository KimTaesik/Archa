var User = require('../models/user.js');
var Data = require('../models/storagelist.js');
var moment = require('moment');
moment.locale('ko');

exports.myArchive = function(req,res,next){
	var user = req.session.user_id.email;
	console.log(user);
	Data.find().or([{ 'rece_id.email' : user },
	              { 'send_id.email' : user }]).exec(function(err,data){
	            	  
		if(err) console.log(err);

		console.log(data);
		res.render('myArchive/marchive', { layout: false, moment:moment, data : data, user : user });
	});
	
}

exports.ALL = function(req,res,next){
	var user = req.session.user_id.email;
	console.log(user);
	Data.find().or([{ 'rece_id.email' : user },
	              { 'send_id.email' : user }]).exec(function(err,data){
	            	  
		if(err) console.log(err);

		console.log(data);
		res.render('myArchive/all', { layout: false, moment:moment, data : data, user : user });
	});
	
}

exports.ARCHIVE = function(req,res,next){
	var user = req.session.user_id.email;
	console.log(user);
	Data.find().or([{ 'rece_id.email' : user },
	              { 'send_id.email' : user }]).exec(function(err,data){
	            	  
		if(err) console.log(err);

		console.log(data);
		res.render('myArchive/archive', { layout: false, moment:moment, data : data, user : user });
	});
	
}

exports.GALLERY = function(req,res,next){
	var user = req.session.user_id.email;
	console.log(user);
	Data.find().or([{ 'rece_id.email' : user },
	              { 'send_id.email' : user }]).exec(function(err,data){
	            	  
		if(err) console.log(err);

		console.log(data);
		res.render('myArchive/gallery', { layout: false, moment:moment, data : data, user : user });
	});
	
}

exports.tabgot = function(req,res,next){
	var user = req.session.user_id.email;
	var category = req.body.category;
	var search = req.body.search;
	Data.find().or([{ 'rece_id.email' : user },
	              { 'send_id.email' : user }]).exec(function(err,data){
	            	  
		if(err) console.log(err);

		res.render('myArchive/got', { layout: false, moment:moment, data : data, user : user, category : category, search:search });
	});
	
}

exports.tabsent = function(req,res,next){
	var user = req.session.user_id.email;
	var category = req.body.category;
	var search = req.body.search;
	Data.find().or([{ 'rece_id.email' : user },
	              { 'send_id.email' : user }]).exec(function(err,data){
	            	  
		if(err) console.log(err);

		res.render('myArchive/sent', { layout: false, moment:moment, data : data, user : user, category : category, search:search });
	});
	
}