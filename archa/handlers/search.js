
var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var Data = require('../models/storagelist.js');
var Room = require('../models/room.js');
var Messagelog = require('../models/messageLog.js');
var moment = require('moment');
var DBright = require('../DB/DBright.js');
moment.locale('ko');
exports.search = function(req, res, next){
	var data = new Data;
	var messagelog = new Messagelog;
	
	res.render('chat/search', { layout:false ,moment:moment, messagelogs:messagelog, data:data });
	
}

exports.archive = function(req, res, next){
	var roomname = req.body.room;
	var data = DBright.getData(roomname);
	var user = req.session.user_id;
	
	data.on('end', function(err, data){
		if(err){
			console.log(err);
		}else{
			res.render('chat/archive', { layout:false, moment:moment, data : data, user: user });
		}
	});
	
}


exports.sendFile = function(req, res, next){
	var roomname = req.body.room;
	var search = req.body.input;
	var user = req.session.user_id;
	
	var data = DBright.getData(roomname);
	data.on('end', function(err, data){
		if(err){
			console.log(err);
		}else{
			res.render('chat/send', { layout:false,moment:moment, data : data, search: search, user:user });
		}
	});	
	
}
exports.receiveFile = function(req, res, next){
	var roomname = req.body.room;
	var search = req.body.input;
	var user = req.session.user_id;
	
	var data = DBright.getData(roomname);
	data.on('end', function(err, data){
		if(err){
			console.log(err);
		}else{
			res.render('chat/receive', { layout:false,moment:moment, data : data, search: search, user:user });
		}
	});	
	
}


exports.fileSearch = function(req, res, next){
	var search = req.body.inputSearchRight;
	var roomname = req.body.room;
	var data = DBright.getData(roomname);
	data.on('end', function(err, data){
		if(err){
			console.log(err);
		}else{
			res.render('chat/dataSearch', { moment:moment,data:data , search:search });
		}
	});
	
}
exports.messageSearch = function(req, res, next){
	var search = req.body.inputSearchRight;
	var roomname = req.body.room;
	var room = DBright.getRoom(roomname);
	room.on('end', function(err, room){
		if(err){
			console.log(err);
		}else{
			res.render('chat/messageSearch', {moment:moment, messagelogs:room.messagelog , search:search});
		}
	});
	
}