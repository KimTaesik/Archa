var userListener = require('../models/userListener.js');
var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var Room = require('../models/room.js');
var EventEmitter = require('events').EventEmitter;
var async = require("async");
exports.chatPage = function(user){
	
	var evt = new EventEmitter();
	var fds = new Friend;
	
	User.
	findOne({email : user.email})
	.populate({path: 'friends.friend' , options: { sort: { 'name': 1 }} })
	.exec(function (err, fd) {
		fds = fd.friends;
		evt.emit('end', err, fds);
	});
	return evt;
}
exports.getRoomInfo = function(room, me){
	var evt = new EventEmitter();
	var users = [];
	var rooms = new Room;
	async.waterfall([
			function (callback) {
				Room.findOne({'id': room}).exec(function(err, room){
					rooms=room;
					rooms.users.pull(me.email);
					callback(null,rooms,evt,users);
				});
			},function(rooms, callback){
				if(rooms.users.length<2){
					User.findOne({'email':rooms.users[0]}).exec(function(err, user){
						users.push(user);
						callback(null,rooms);
					});
				}else{
	    			for(i in rooms.users){
	    				User.findOne({'email':String(rooms.users[i])}).exec(function(err, user){
	    					if(!err && user != null){
	    						users.push(user);
	    						if(i == rooms.users.length-1) callback(null,rooms);
	    					}else{
	    						console.log(err);
	    						if(i == rooms.users.length-1) callback(null,rooms);
	    					}
	    				});
	    			}								
				}
			}
			],function (err,rooms) {
		console.log(rooms);
		evt.emit('end', err, rooms, users);

	});
	return evt;
}
exports.getFriend = function(user, gname){
	var evt = new EventEmitter();
	var fds = new Friend;
	
	User.
	findOne({email : user.email})
	.populate({
		path	: 'friends.friend', options: { sort: { 'name': 1 }} 
	})
	.exec(function (err, fd) {
		var fds = fd.friends;
		evt.emit('end', err, fds);
	});
	
	return evt;	
}
exports.getInvite = function(roomId, user){
	var evt = new EventEmitter();
	var fds = new Friend;
	
	User.
	findOne({email : user.email})
	.populate({
		path	: 'friends.friend'
	})
	.exec(function (err, fd) {
		if(!err){
			Room.findOne({'id':roomId}, function(err, room){
				var fds = fd.friends;
				evt.emit('end', err, fds, room.users);					
			});	
		}
	});
	
	return evt;		
}
exports.addGroup = function(user, gname){
	var evt = new EventEmitter();
//	User.findOne({'email':user.email}).exec(function(err,user){
//		user.groups.push(gname);
//		user.save(function(err){
//			if(err){
//				console.log(err);
//			}else{
//				evt.emit('end', err, user);
//			}
//		});		
//	});
	User.update({'email':user.email},{ $addToSet:{ groups: gname }}).exec(function(err, result){
		if(err) console.log(err);
		
		if(result.nModified == 1){
			user.groups.push(gname);
		}
		evt.emit('end', err, user);
	});
	return evt;	
};

exports.groupOut = function(user, friend ,gname){
	var evt = new EventEmitter();
	var fds = new Friend;
	User.findOne({'email':user.email})
	.populate({
		path	: 'friends.friend'	, options: { sort: { 'name': 1 }} 
	})
	.exec(function(err,user){
		for(index in user.friends){
			if(user.friends[index].friend.email == friend && user.friends[index].groupname == gname){
				user.friends[index].groupname = 'default';
			}
		}
		user.save(function(err){
			if(err){
				console.log(err);
			}else{
				var fds = user.friends;
				evt.emit('end', err, user, fds );
			}
		});
		
	});
	
	return evt;
};

exports.addChkUser = function(user, friends ,gname){
	var evt = new EventEmitter();
	var fds = new Friend;
	var temp = new Array();
	if(friends[0][0].length > 2){
		for(index in friends[0]){
			temp.push(friends[0][index]);			
		}
	}
	User.findOne({'email':user.email})
	.populate({
		path	: 'friends.friend'	, options: { sort: { 'name': 1 }} 
	})
	.exec(function(err,user){
		for(index in user.friends){
			if(friends[0][0].length < 2){
				if(user.friends[index].friend.email == friends && user.friends[index].groupname == 'default'){
					user.friends[index].groupname = gname;
				}
			}else{
				for(index in temp){
					if(user.friends[index].friend.email == temp[index] && user.friends[index].groupname == 'default'){
						user.friends[index].groupname = gname;
					}					
				}
			}
		}
		user.save(function(err){
			if(err){
				console.log(err);
			}else{
				var fds = user.friends;
				evt.emit('end', err, user, fds );
			}
		});
		
	});
	
	return evt;
};

exports.deleteGroup = function(user, gname){
	var evt = new EventEmitter();
	var fds = new Friend;
	
	User.findOne({'email':user.email}).exec(function(err,user){
		
		user.groups.pull(gname);
		
		for(index in user.friends){
			if(user.friends[index].groupname == gname){
				user.friends[index].groupname = 'default';
			}
		}
		user.save(function(err){
			if(err){
				console.log(err);
			}else{
				evt.emit('end', err, user);
			}
		});		
	});
//	var query = { $and: [{ email: user.email},{ 'friends.groupname': gname }]};
//
//	User
//	.update(query, { $set: { 'friends.groupname': 'default' }},{ multi: true })
//	.exec(function(err, raw){
//		if(raw>1){
//			User.findOne({'email':user.email}).exec(function(err,user){
//				user.groups.pull(gname);
//				user.save(function(err){
//					if(err){
//						console.log(err);
//					}else{
//						evt.emit('end', err, user);
//					}
//				});		
//			});
//		}else{
//			console.log('수정실패');
//			console.log(err);
//		}
//	});
	return evt;
}
