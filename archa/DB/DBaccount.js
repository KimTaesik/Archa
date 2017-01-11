var userListener = require('../models/userListener.js');
var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var EventEmitter = require('events').EventEmitter;

exports.login = function(email, password){
	var evt = new EventEmitter();
	
	User.findOne({'email':email, 'password':password}).populate({path: 'friends.friend'}).exec(function(err,user){
		evt.emit('end', err, user);
	});
	
	return evt;
}

exports.getFriend = function(user){
	var evt = new EventEmitter();
	var fds = new Friend;
	
	User
	.findOne({email : user.email})
	.populate({path: 'friends.friend'})
	.exec(function (err, fd) {
		if(err){
			console.log(err);
		}else{
		  	fds = fd.friends;
		  	evt.emit('end', err, fds);
		}
	});
	return evt;	
}
exports.leftmenu = function(user){
	
	var evt = new EventEmitter();
	var fds = new Friend;
	
	User
	.findOne({email : user.email})
	.populate({path: 'friends.friend'})
	.exec(function (err, fd) {
		if(err){
			console.log(err);
		}else{
		  	fds = fd.friends;
		  	evt.emit('end', err, fds);
		}
	});
	return evt;
}

exports.register = function(user){
	var evt = new EventEmitter();
	
	user.save(function(err){
		evt.emit('end', err, 'success');
	});
	return evt;
}



exports.updateMyInfo = function(email, company, position, phoneNumber){
	var evt = new EventEmitter();
	User.findOne({'email':email})
	.populate({path: 'friends.friend'})
	.exec(function(err,user){
		if(err){
			console.log(err);
		}else{
			user.company = company;
			user.position = position;
			user.phoneNumber = phoneNumber;
			
			user.save(function(err,silence){
				if(err){
					console.log(err);
				}else{
					evt.emit('end', err,user, user.friends);
				}
			});
		}
	});
	return evt;
}


exports.signOutUser = function(email,password){
	var evt = new EventEmitter();
	var user = User.find({'email':email,'password':password});
    user.remove(function(err){
    	evt.emit('end',err,'success');
    });	
}
exports.allUser = function(input){
	var evt = new EventEmitter();
	var term = new RegExp(input, 'i');
	User.find().or([{ email: { $regex: term }}, 
	                { name: { $regex: term }}, 
	                { company: { $regex: term }}, 
	                { position: { $regex: term }}, 
	                { phoneNumber: { $regex: term }}]).
	                exec(function(err,user){
	                	evt.emit('end',err,user);
	            	});
	return evt;
}
exports.searchFriend = function(user, inputSearchMember){
	var evt = new EventEmitter();
	var fds = new Friend;
	var term = new RegExp(inputSearchMember, 'i');
	
	User
	.findOne({email : user.email})
	.populate({ 
		  path	: 'friends.friend',
		  match : { $or: [{ email: { $regex: term }}, 
		                  { name: { $regex: term }}, 
		                  { company: { $regex: term }}, 
		                  { position: { $regex: term }}, 
		                  { phoneNumber: { $regex: term }}]
		          }
	})
	.exec(function (err, fd) {
		  if(!err){
		  	fds = fd.friends;
		  	evt.emit('end',err,fds);
		  }else{ console.log(err)}
	});	
	return evt;
}
exports.addFriend = function(user, friend){
	var evt = new EventEmitter();
	if(friend != user.email){
		
		User.findOne({'email': friend }).exec(function(err,friend){
			User.update({'email':user.email},{ $addToSet:{ 'friends': { 'friend' : friend._id }}},{multi:true}).exec(function(err, result){
				if(err) console.log(err);
				
				if(result.nModified == 1){
					var fd = new Friend({
						friend : friend,
						groupname : 'default'
					})
					user.friends.push(fd);
				}
				evt.emit('end',err,user,user.friends);
			});
		});
	}
	return evt;
}

exports.deleteFriend = function(user, friend){
	var evt = new EventEmitter();
	
	User.findOne({'email':friend}).exec(function(err,friend){
		User.findOneAndUpdate({'email': user.email}, { $pull:{'request':{'email':you}} },{upsert: true, 'new': true})
		.populate({
			path	: 'friends.friend'
		}).exec(function(err, doc){
			req.session.user_id = doc;
			evt.emit('end',err,user,user.friends);
		});
	});
	return evt;
}

