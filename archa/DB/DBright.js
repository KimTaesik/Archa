var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var Data = require('../models/storagelist.js');
var Room = require('../models/room.js');
var Messagelog = require('../models/messageLog.js');

var EventEmitter = require('events').EventEmitter;
var moment = require('moment');

exports.chatPage = function(user){
	
	var evt = new EventEmitter();
	
	var fds = new Friend;
	
	User.
	findOne({email : user.email})
	.populate({path: 'friends.friend'})
	.exec(function (err, fd) {
		var fds = fd.friends;
		evt.emit('end', err, fds);
	});
	return evt;
}
exports.getData = function(roomname){
	var evt = new EventEmitter();
	
	Data.find({'room_name' : roomname}, function(err,data){
		if(err) console.log(err);

		evt.emit('end', err, data);
		
	});
	return evt;
}

exports.getRoom = function(roomname){
	var evt = new EventEmitter();

	Room.findOne({'roomname' : roomname}, function(err,room){
		evt.emit('end', err, room);
	});
	
	return evt;	
//	Room.find({
//		$and: [
//		       { 'roomname' : req.body.room },
//		       { $or: [{ 'messagelog.email': { $regex: term }}, 
//		               { 'messagelog.name' : { $regex: term }},  
//		               { 'messagelog.message' : { $regex: term }}] }
//	          ]
//	}, 'messagelog', function (err, results) {
//		console.log(results)
//	});
	
//	var term = new RegExp(req.body.inputSearchRight, 'i');
//	Room.find({roomname: room, $or: [{ 'messagelog.email': { $regex: term }}, 
//	       		                  { 'messagelog.name' : { $regex: term }},  
//	    		                  { 'messagelog.message' : { $regex: term }}] }, 'Room.messagelog').
//	                exec(function(err,room){
//	                	console.log(room);
//	            	});
//	Room.findOne().and({'roomname':req.body.room}, 'messagelog').or([{ 'messagelog.email': { $regex: term }}, 
//	          	       		                  { 'messagelog.name' : { $regex: term }},  
//	          	    		                  { 'messagelog.message' : { $regex: term }}]).exec(function(err, room){
//		if(err) console.log(err);
//		
//		console.log(room);
//	});
}