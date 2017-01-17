var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var Room = require('../models/room.js');
var Message = require('../models/message.js');
var Data = require('../models/storagelist.js');
var RoomName = require('../models/roomName.js');
var async = require("async");
var socketio = require('socket.io');
var UrlPattern = require('url-pattern');
var pattern = new UrlPattern('(http(s)\\://)(:subdomain.):domain.:tld(\\::port)(/*)');
var moment = require('moment');
moment.locale('ko');
var og = require('open-graph');
var util = require('util');
var ogs = require('open-graph-scraper');

var io,
    guestNumber,
    nickNames,
    namesUsed,
    userList,
    currentRoom;

guestNumber = 1;
userList = {};
nickNames = {};
namesUsed = [];
currentRoom = {};
room = {};
sockets = [];
var match
match = {};
var io;
var urlPattern = /(http|ftp|https|www|[\w])+(\.|:)+[\/\/\]+[\w-]+(\.[\w-])*([com])+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
var youPattern = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
module.exports = function(server){
	io = require('socket.io')(server);
	
	io.on('connection', function(socket){
    	sockets.push(socket);	   
    	
        socket.on('myId', function(id) {
        	console.log('yes!');
        	User.findOneAndUpdate({'email':id}, { $set:{'state' : 1 }},{upsert: true, 'new': true});
        	nickNames[socket.id] = id;
        });
        
        socket.on('disconnect', function() {
    		User.findOneAndUpdate({'email':nickNames[socket.id]}, { $set:{'state' : 0 }},{upsert: true, 'new': true});
        	console.log('bye!');
            delete nickNames[socket.id];
        });
        
	    socket.on('join', function(room, me, youName) {
	    	if(nickNames[socket.id] == me){
		    	var thisRoom;
		    	if(room.you != room.me){
		    		Room.count({'id': room.me+"/"+room.you},function(err,count){
		    			if(count == 0){
		    		    	thisRoom = room.you+"/"+room.me;
		    			}else{
		    				thisRoom = room.me+"/"+room.you;
		    			}

	    		        socket.join(thisRoom);
	    			    socket.room = thisRoom;
//	    			    console.log(io.sockets.manager.room['/'+socket.room]);
	    		    	Room.findOne({'id':thisRoom}, function(err, room){
	    		    		if(err) console.log(err);
	    		    		if(room != null){
		    		    		var chk = 1;
		    		    		for(var index in room.users){
		    		    			if(nickNames[socket.id] == room.users[index]){
		    		    				chk=0;
		    		    			}
		    		    		}
		    		    		if(chk){
		    		    			room.users.push(nickNames[socket.id]);
		    		    			room.save();
		    		    		}
		    		    		var users = room.users;
		    		    		User.findOne({'email': nickNames[socket.id]},function(err, user){
		    		    			var roomNameChk = 1;
		    		    			var rn = '';
		    		    			for(var index in user.roomName){
		    		    				if(socket.room == user.roomName[index].roomId){
		    		    					roomNameChk = 0;
		    		    					rn=user.roomName[index].rName;
		    		    					io.sockets.to(socket.room).sockets[socket.id].emit('usercount', users, socket.room,rn);
		    		    				}
		    		    			}
		    		    			if(roomNameChk){
		    		    				User.update({'email':nickNames[socket.id]},{ $addToSet:{ 'roomName': { 'roomId' : socket.room, 'rName': youName }}},{multi:true}).exec(function(err, result){
		    		    					if(result){
		    		    						io.sockets.to(socket.room).sockets[socket.id].emit('usercount', users, socket.room,youName);
		    		    					}
		    		    				});
		    		    			}
		    						Data.find({'room_id':socket.room}, function(err, data){
		    				    		if(!err && data != null){
		    				    			io.sockets.to(socket.room).sockets[socket.id].emit('roomLoad', user.email, room, data);
		    				    		}
		    				    	});
		    		    			
//		    		    			loadMessage(socket, room);
		    		    		});
	    		    		}
	    		    	});
		    		});
		    	}
	    	}
	    });

        socket.on('rooms', function(user) {  
        	Room.find({users:user}).exec(function (err, rooms) {
				if(err) console.log(err);
				else{
					User.findOne({'email':user},'-_id roomName').exec(function(err,roomName){
						socket.emit('rooms', rooms,roomName, user);
					});
				}
			});
//        	Room.update({'id': socket.room}, {$addToSet: {'messagelog.$*.readby' : 'asdasd@naver.com'} }, {multi:true}, function(err){
//                if(err){
//                        console.log(err);
//                }else{
//                        console.log("Successfully added");
//                }
//        	});
        });
        /*
         * user search 한 후에 상대방의 user db->request에 자신의 정보 저장
         * 하면서 해당 사용자가 접속해있으면 socket으로 div에 삽입시킬 데이터 전송
         */
        socket.on('newRelation', function(id, name, company, position){
        	var myId = nickNames[socket.id];
        	if(myId!=id){
	        	User.update({'email':id},
	        			{ $addToSet: { 
	        							'request': 
	        							{
	        							 'email'	: myId,
	        							 'name' 	: name,
	        							 'company' 	: company,
	        							 'position' : position
	        							}
	        						 }
	        			},{multi:true})
	        	.exec(function(err, result){
	        		if(err) console.log(err);
	        		console.log(result)
	        		
	        		if(result){
	        			var test = findUserByName(id);
	        			if(test){
	        				io.sockets.connected[test].emit('request',myId,name,company,position);
	        			}
	        		}
	        	});
        	}
        });
        /*
         * 요청승인에 대한 request쪽 뷰 수정 요청 보내기
         */
        socket.on('requestConn', function(you, me){
			var test = findUserByName(you);
			if(test){
				io.sockets.connected[test].emit('history',you,me);
			}     
        });
        socket.on('connHistory', function(you, me){
			var test = findUserByName(you);
			if(test){
				io.sockets.connected[test].emit('history',you,me);
			}            
        	
        });
        socket.on('decline', function(id){
        	User.update({'email': nickNames[socket.id] },{$pull:{'request':{'email':id}}}).exec(function(err,result){
        	});
        });
	    socket.on('rejoin', function(roomName, me){
	    	socket.join(roomName);
	    	socket.room = roomName;
	    	Room.findOne({'id':roomName}, function(err, room){
	    		if(err) console.log(err);
	    		
	    		var name='';
	    		
	    		if(room != null){
		    		var users = room.users;
		    		var chk = 1;
		    		for(var index in room.users){
		    			if(nickNames[socket.id] == room.users[index]){
		    				chk=0;
		    			}else{
		    				name += room.users[index]+'';
		    				if(index>0 && index != room.users.length) name += ',';
		    			}
		    		}
		    		if(chk){
		    			room.users.push(nickNames[socket.id]);
		    			room.save();
		    		}
		    		User.findOne({'email': nickNames[socket.id]},function(err, user){
		    			var roomNameChk = 1;
		    			var rn = '';
		    			for(var index in user.roomName){
		    				if(socket.room == user.roomName[index].roomId){
		    					roomNameChk = 0;
		    					rn=user.roomName[index].rName;
		    					io.sockets.to(socket.room).sockets[socket.id].emit('usercount', users, socket.room,rn);
		    				}
		    			}
		    			if(roomNameChk){
		    				User.update({'email':nickNames[socket.id]},{ $addToSet:{ 'roomName': { 'roomId' : socket.room, 'rName': name }}},{multi:true}).exec(function(err, result){
		    					if(result){
		    						io.sockets.to(socket.room).sockets[socket.id].emit('usercount', users, socket.room, name);
		    					}
		    				});
		    			}
						Data.find({'room_id':socket.room}, function(err, data){
				    		if(!err && data != null){
				    			io.sockets.to(socket.room).sockets[socket.id].emit('roomLoad', user.email, room, data);
				    		}
				    	});
		    		});
	    		}
	    	});
	    });
	    socket.on('roomChange', function(newRoomId){
	    	socket.join(newRoomId);
			socket.room = newRoomId;
	    });
	    
	    socket.on('inviteRoom', function(roomID, inviteUsers){
	    	
	    	var roomchk = roomID.split('/');
	    	var newId = roomID+'/group';
//	    	var changeRoom = new Room();
	    	if(!roomchk[2] && inviteUsers.length > 0){
//	    		var changeRoom = Room.findOne({'roomname':roomID});
	    		Room.findOne({'id':roomID}, function(err, room){

					async.waterfall([
						function (callback) {
							room.id = newId;
//			    			room.users.push(inviteUsers);
			    			for(var index in inviteUsers){
			    				room.users.push(inviteUsers[index]);
			    			}

							callback(null, room);
						},
						function (room, callback) {
			    			for( i in room.users){
			    				User.update({'email':String(room.users[i])},{ $addToSet:{ 'roomName': { 'roomId' : room.id, 'rName': '그룹 채팅방' }}},{multi:true}).exec(function(err, result){
			    				});
			    			}
							callback(null, room);
						},
					],
						function (err, room) {

		    				room.save(function(err){
	    						if(err){
	    							console.log(err);
	    						}else{
	    							var newuser = room.users;
	    							var roomName = '그룹 채팅방';	    							
	    			    			//방에 접속한 사람들에게 방 변경 메시지 보냄
	    			    			io.sockets.to(socket.room).clients(function(error,clients){
	    			    				if(clients){
	    				    				for(var index in clients){
	    				    					io.sockets.to(socket.room).sockets[clients[index]].emit('roomChange', newroom, newuser, roomName);
	    				    				}
	    			    				}
	    			    			});
	    						}
	    					});
					});
					
	    		});
	    		
	    	}else{
	    		//그룹방에서의ㅣ 초대
	    		Room.findOne({'id':roomID}, function(err, room){
					async.waterfall([
						function (callback) {
//			    			room.users.push(inviteUsers);
			    			for(var index in inviteUsers){
			    				room.users.push(inviteUsers[index]);
			    			}
							callback(null, room);
						},
						function (room, callback) {
			    			for( i in room.users){
			    				User.update({'email':String(room.users[i])},{ $addToSet:{ 'roomName': { 'roomId' : room.id, 'rName': '그룹 채팅방' }}},{multi:true}).exec(function(err, result){
			    				});
			    			}
							callback(null, room);
						},
					],
						function (err, room) {
		    				room.save();
					});
					
	    		});
	    			    		
	    	}
	    	
	    });
	    socket.on('dataInfoSend', function(data, send_userEmail, send_userName){
			var message = new Message({
				mtype	: 'data',
				email	: send_userEmail,
				name	: send_userName,
				message : data.name,
				mdate	: data.date
			});
			console.log(data.date);
			
			Room.findOne({'id':socket.room},function(err, room){
				if(err) console.log(err);
				else {
					room.messagelog.push(message);
					room.save();
					
				    io.sockets.to(socket.room).sockets[socket.id].emit('my data', data, send_userEmail, send_userName);
					socket.broadcast.to(socket.room).emit('other data', data, send_userEmail, send_userName);
				}
			});
	    });
	    socket.on('roomOut', function(room, me){
	    	Room.findOne({'roomname':room, 'users':me}, function(err,room){
	    		room.users.pull(me);
	    		room.save();
	    	});
	    });
	    
	    socket.on('changeRoomName', function(id, room, newName){
//	    	User.update({'email':id,'roomName':{ 'roomId': socket.room }},
//	    			{$set:{ 'roomName.$.rName': newName } },{upsert: true, multi:true}).exec(function(err,result){
//	    		if(err) console.log(err);
//	    	});
	    	
	    	User.findOne({'email':id}, function(err, user){
	    		for(index in user.roomName){
	    			if(user.roomName[index].roomId == socket.room){
	    				user.roomName[index].rName = newName;
	    				io.sockets.sockets[socket.id].emit('roomNameChange', socket.room , newName);	
	    			} 
	    		}
	    		user.save();
	    	});	
	    });
	    socket.on('getOgData', function(val,i){
	    	var youtube = youPattern.exec(val.url);
	    	var options = {'url': val.url};
	    	ogs(options, function (err, meta) {
	    		console.log('og:', meta);
	    		if(err){
	    			console.log('시발');
	    		}else if(meta == undefined || meta.data.ogUrl == undefined && meta.data.ogImage== undefined){
	    			var meta = {
	    				data:{
		    				ogUrl : val.url,
		    				ogImage : { url : 'https://www.google.com/s2/favicons?domain='+val.url},
		    				ogDescription : meta.data.ogDescription == undefined && meta.data.ogTitle != undefined ? meta.data.ogTitle : ''
	    				}
	    			}
	    			io.sockets.to(socket.room).sockets[socket.id].emit('ogData', meta, val.url, val.email,nickNames[socket.id],i,val);
	    		}else{
		    		if(youtube != null && youtube.length>1){
		    			io.sockets.to(socket.room).sockets[socket.id].emit('youOgData', meta, val.url, val.email,nickNames[socket.id],i,val);
		    		}else{
		    			io.sockets.to(socket.room).sockets[socket.id].emit('ogData', meta, val.url, val.email,nickNames[socket.id],i,val);
		    		}	    			
	    		}
	    	});
/*	    	og(val.url, function(err, meta){
	    		console.log('og:', meta);
	    		if(meta == undefined && meta.url == undefined && meta.image== undefined){
	    			var meta = {
	    				url : val.url,
	    				image : { url : 'https://www.google.com/s2/favicons?domain='+val.url},
	    				description : ''
	    			}
	    			io.sockets.to(socket.room).sockets[socket.id].emit('ogData', meta, val.url, val.email,nickNames[socket.id],i,val);
	    		}else{
		    		if(youtube != null && youtube.length>1){
		    			io.sockets.to(socket.room).sockets[socket.id].emit('youOgData', meta, val.url, val.email,nickNames[socket.id],i,val);
		    		}else{
		    			io.sockets.to(socket.room).sockets[socket.id].emit('ogData', meta, val.url, val.email,nickNames[socket.id],i,val);
		    		}	    			
	    		}

	    	});*/
	    });
	    socket.on('readMessageSave', function(room){
	    	console.log(room.messagelog[0].readby);
	    	Room.findOne({'id':room.id}).exec(function(err, result){
	    		result.messagelog = room.messagelog;
	    		result.save();
	    	});
	    });
		socket.on('message', function(msg){
			var messageDate = new Date();
			var roomUser= new Message;
			async.waterfall([
			    function (callback) {
	    			io.sockets.to(socket.room).clients(function(error,clients){
	    				if(clients){
		    				for(var index in clients){
		    					roomUser.readby.push(nickNames[clients[index]]);
		    					if(index==clients.length-1){
		    						callback(null);
		    					}
		    				}
	    				}
	    			});
			    },function (callback) {
					var checkMatch = urlPattern.exec(msg.msg);
					console.log(checkMatch);
				    if(checkMatch != null && checkMatch.length>1){
				    	
				    	var checkText = checkMatch[0];
				    	
				    	var options = {'url': checkText};
				    	ogs(options, function (err, meta) {
				    		callback(null, meta);
				    	});
				    }else{
				    	var meta = 'end';
				    	callback(null, meta);
				    }
				    
				},function (meta, callback) {
					var message = new Message();
				    if(meta != 'end'){
				    	var checkMatch = urlPattern.exec(msg.msg);
				    	var checkText = checkMatch[0];
						message = new Message({
							mtype	: 'url',
							email	: nickNames[socket.id],
							name	: msg.me,
							message : msg.msg, 
							url		: meta == undefined || meta.data.ogUrl == undefined ? checkText : meta.data.ogUrl,
							og		: { 'title' : meta == undefined || meta.data.ogTitle == undefined ? checkText : meta.data.ogTitle,
										'description' :meta == undefined || meta.data.ogDescription == undefined ? '' : meta.data.ogDescription
							},
							readby	: roomUser.readby,
							mdate	: messageDate
						});
						callback(null, message);
				    }else{
						message = new Message({
							mtype	: msg.type,
							email	: nickNames[socket.id],
							name	: msg.me,
							message : msg.msg, 
							readby	: roomUser.readby,
							mdate	: messageDate
						});
						callback(null, message);
				    }
				},function (message, callback) {
					Room.findOne({'id':socket.room},function(err, room){
						if(room == null){
							User.update({'email':msg.email},{ $addToSet:{ 'roomName': { 'roomId' : socket.room, 'rName': msg.yourName }}},{multi:true}).exec(function(err, result){
								if(err) console.log(err);
								
								if(result){
									var uList = socket.room.split('/');
									var room = new Room({
										id : socket.room,
										users : uList,
										messagelog : message,
										roomdate : new Date()
									});
									
									room.save();
									io.sockets.to(socket.room).emit('usercount', uList, socket.room, msg.yourName);									
								}
							});
						}else{
							room.messagelog.push(message);
							room.save();
						}
					});
					callback(null, message);
				}],function (err, message) {
					console.log(message);
				    match = urlPattern.exec(message.message);
				    if(match != null && match.length>1){
				    	var text = match[0];
				    	var ytMatch = youPattern.exec(text);
				    	var options = {'url': text};
				    	ogs(options, function (err, meta) {
				    		console.log(meta);
				    		if(ytMatch != null && ytMatch.length>1){
				    			console.log('유툽')
							    io.sockets.to(socket.room).sockets[socket.id].emit('my message youtube', message, meta);
								socket.broadcast.to(socket.room).emit('other message youtube', message, meta);
				    		}else if(meta != undefined && meta.data.ogUrl != undefined){
				    			console.log('url메시지')
							    io.sockets.to(socket.room).sockets[socket.id].emit('my message url', message, meta);
								socket.broadcast.to(socket.room).emit('other message url', message, meta);
				    		}else{
				    			var meta = {
					    				url : text,
					    				image : { url : 'https://www.google.com/s2/favicons?domain='+text},
					    				description : ''
					    			}
				    			console.log('일반메시지');
							    io.sockets.to(socket.room).sockets[socket.id].emit('my message url', message, meta);
								socket.broadcast.to(socket.room).emit('other message url', message, meta);
//							    io.sockets.to(socket.room).sockets[socket.id].emit('my message', msg);
//								socket.broadcast.to(socket.room).emit('other message', msg);
				    		}
				    	});
	
				    }else{
					    io.sockets.to(socket.room).sockets[socket.id].emit('my message', message);
						socket.broadcast.to(socket.room).emit('other message', message);
				    }
				    Room.findOne({'id': socket.room}).exec(function(err,room){
				    	io.sockets.sockets[socket.id].emit('refresh', socket.room , message.message, messageDate,room,nickNames[socket.id]);	
				    });
				}
			);
		    
		});
	});
	
	return io;
}
function loadMessage(socket,room){
	async.eachSeries(room.messagelog, function (value, callback) {
		var msg = {
				type : value.mtype,
				email : value.email,
				me : value.name,
				msg : value.message
			};
			if(nickNames[socket.id] == value.email){
				if(msg.type != 'data'){
				    match = urlPattern.exec(msg.msg);
				    if(match != null && match.length>1){
				    	var text = match[0];
				    	var ytMatch = youPattern.exec(text);
				    	
					    	og(text, function(err, meta){
					    		if(meta){
					    			if(ytMatch != null && ytMatch.length>1){
					    				io.sockets.to(socket.room).sockets[socket.id].emit('my message youtube', msg, meta);
					    			}else{
					    				io.sockets.to(socket.room).sockets[socket.id].emit('my message url', msg, meta);
					    			}
					    		}else{
					    			io.sockets.to(socket.room).sockets[socket.id].emit('my message', msg);
					    		}
							    callback();
					    	});
				    }else{
					    io.sockets.to(socket.room).sockets[socket.id].emit('my message', msg);
				    	callback();
				    }
				}else{
					Data.findOne({'room_name':socket.room,'send_id.email':value.email, 'name':msg.msg }, function(err, data){
			    		if(!err && data != null){
			    			io.sockets.to(socket.room).sockets[socket.id].emit('my data', data, value.email, value.name);
			    		}
			    		callback();
			    	});
				}
			}else{
				if(msg.type != 'data'){
				    match = urlPattern.exec(msg.msg);
				    if(match != null && match.length>1){
				    	var text = match[0];
				    	var ytMatch = youPattern.exec(text);
				    	
				    	og(text, function(err, meta){
				    		if(meta){
				    			if(ytMatch != null && ytMatch.length>1){
				    				io.sockets.to(socket.room).sockets[socket.id].emit('other message youtube', msg, meta);
				    			}else{
				    				io.sockets.to(socket.room).sockets[socket.id].emit('other message url', msg, meta);
				    			}
				    		}else{
				    			io.sockets.to(socket.room).sockets[socket.id].emit('other message', msg);
				    		}
				    		callback();
				    	});
				    }else{
				    	io.sockets.to(socket.room).sockets[socket.id].emit('other message', msg);
				    	callback();
				    }	
				}else{
					Data.findOne({'room_name':socket.room,'send_id.email':value.email, 'name':msg.msg }, function(err, data){
			    		if(!err && data != null){
			    			io.sockets.to(socket.room).sockets[socket.id].emit('other data', data, value.email, value.name);
			    		}
			    		callback();
			    	});
					
				}
			}
	}, function (err) {
		if (err) console.error(err.message);
	})
}
function getRoom(name){
	
}
function myData(){
	
}
function otherData(sockets, data, email, name){
	
}
//you could use e.g. underscore to achieve this (
function findUserByName(name){
  for(socketId in nickNames){
    if(nickNames[socketId] === name){
      return socketId;
    }
  }
}
/*exports.listen = function(server) {
    io = socketio.listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
        joinRoom(socket, 'Lobby');

        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        socket.on('rooms', function() {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        handleClientDisconnection(socket, nickNames, namesUsed);
    });
};*/

/*function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber + 1;
}

function handleRoomJoining(socket) {
    socket.on('join', function(room) {
        socket.leave(currentRoom[socket.id]);
        socket.join(room.you+"/"+room.me);
	    socket.room = room.you+"/"+room.me;
        var msg = {
        		text : 'joined ' + room.name + '.',
        		name : room.name
        }
        socket.to(socket.room).emit('system message', msg);
    });
}

function joinRoom(socket, room) {
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room: room});
    socket.broadcast.to(room).emit('message', {
        text: nickNames[socket.id] + ' has joined ' + room + '.'
    });

    var usersInRoom = io.sockets.clients(room);
    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ', ';
                }

                usersInRoomSummary += nickNames[userSocketId];
            }
        }

        usersInRoomSummary += '.';
        socket.emit('message', {text: usersInRoomSummary});
    }
}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function(name) {
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now know as ' + name + '.'
                });
            } else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}

function handleMessageBroadcasting(socket) {
    socket.on('message', function(message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        });
    });
}



function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
}*/