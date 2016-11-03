var User = require('../models/user.js');
var Friend = require('../models/friend.js');
var Room = require('../models/room.js');
var Message = require('../models/message.js');
var Data = require('../models/storagelist.js')

var socketio = require('socket.io');
var UrlPattern = require('url-pattern');
var pattern = new UrlPattern('(http(s)\\://)(:subdomain.):domain.:tld(\\::port)(/*)');
var og = require('open-graph');

var io,
    guestNumber,
    nickNames,
    namesUsed,
    userList,
    currentRoom;

guestNumber = 1;
userList = [];
nickNames = {};
namesUsed = [];
currentRoom = {};
room = {};
sockets = [];
var match
match = {};
var io;
var urlPattern = /(http|ftp|https|www|[\w])+(\.|:)+[\/\/\]+[\w-]+(\.[\w-])*([com])+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
    
module.exports = function(server){
	io = require('socket.io')(server);
	
	io.on('connection', function(socket){
    	sockets.push(socket);	   
    	
        socket.on('myId', function(id) {
        	nickNames[socket.id] = id;
    	    io.sockets.clients(function(error,clients){
    	    	if (error) throw error;
    	    	console.log("전체접속자: " + clients);
    	    });
        	console.log("내 ID : "+nickNames[socket.id]+"/////////"+socket.id);
        	
        });

	    socket.on('join', function(room) {
	    	console.log('join enter')
	    	userList = [];
	    	var thisRoom;
	    	if(room.you != room.me){
	    		Room.count({'roomname': room.me+"/"+room.you},function(err,count){
	    			if(count == 0){
	    		    	thisRoom = room.you+"/"+room.me;
	    			}else{
	    				thisRoom = room.me+"/"+room.you;
	    			}
    		    	userList.push(room.me);
    		    	userList.push(room.you);
    		    	
    		        socket.join(thisRoom);
    			    socket.room = thisRoom;
    			    
    		    	Room.findOne({'roomname':thisRoom}, function(err, room){
    		    		if(err) console.log(err);
    		    		if(room != null){
	    		    		var users = room.users;
	    		    		io.sockets.to(socket.room).emit('usercount', users,thisRoom);
    		    			loadMessage(socket, room);
    		    		}
    		    	});
	    		});
	    	}	
	    });

        socket.on('rooms', function(user) {  
        	Room
			.find({users:user}, 'roomname')
			.exec(function (err, rooms) {
				if(err) console.log(err);
				socket.emit('rooms', rooms);
			});
        });
        
        socket.on('namecard', function(namecard) {  
        	console.log('zzzzzz')
        });
        
	    socket.on('rejoin', function(roomName){
	    	console.log(nickNames[socket.id]+"///"+socket.id+"////roomname: "+roomName);
	    	socket.join(roomName);
	    	socket.room = roomName;
	    	Room.findOne({'roomname':roomName}, function(err, room){
	    		if(err) console.log(err);
	    		if(room != null){
		    		var users = room.users;
		    		io.sockets.to(socket.room).emit('usercount', users,thisRoom);
	    			loadMessage(socket, room);
	    		}
	    	});
	    });
	    socket.on('dataInfoSend', function(data, send_userEmail, send_userName){
			var message = new Message({
				mtype	: 'data',
				email	: send_userEmail,
				name	: send_userName,
				message : data.name, 
				mdate	: new Date
			});
			
			Room.findOne({'roomname':socket.room},function(err, room){
				if(err) console.log(err);
				else {
					room.messagelog.push(message);
					room.save();
					
				    io.sockets.to(socket.room).emit('my data', data, send_userEmail, send_userName);
					socket.broadcast.to(socket.room).emit('other data', data, send_userEmail, send_userName);
				}
			});
	    });
		socket.on('message', function(msg){
			console.log("보낸메시지 : "+msg.msg+"\n방이름 : "+socket.room+"\n닉네임 : "+nickNames[socket.id]+"///"+msg.me);
//			var pattern2 = pattern.match(msg.msg); 익플 하위에서 안먹음 ㅅㅂ
		    
			var message = new Message({
				mtype	: msg.type,
				email	: nickNames[socket.id],
				name	: msg.me,
				message : msg.msg, 
				mdate	: new Date
			});
			
			Room.findOne({'roomname':socket.room},function(err, room){
				if(room == null){
					var room = new Room({
						roomname : socket.room,
						users : userList,
						messagelog : message,
						roomdate : new Date()
					});
					
					room.save(function(err){
						if(err){
							console.log(err);
							return;
						}
					});
					io.sockets.to(socket.room).emit('usercount', userList,socket.room);
				}else{
					room.messagelog.push(message);
					room.save();
				}
			});
			//메시지 저장
		    match = urlPattern.exec(msg.msg);
		    if(match != null && match.length>1){
		    	var text = match[0];
		    	og(text, function(err, meta){
				    io.sockets.to(socket.room).emit('my message url', msg, meta);
					socket.broadcast.to(socket.room).emit('other message url', msg, meta);
		    	});
		    }else{
			    io.sockets.to(socket.room).emit('my message', msg);
				socket.broadcast.to(socket.room).emit('other message', msg);
		    }
		});
	});
	
	return io;
}
function loadMessage(socket,room){
	
	for(var index in room.messagelog){
		var msg = {
			type : room.messagelog[index].mtype,
			email : room.messagelog[index].email,
			me : room.messagelog[index].name,
			msg : room.messagelog[index].message
		};
		console.log(msg);
		if(nickNames[socket.id] == room.messagelog[index].email){
			if(msg.type != 'data'){
				console.log('메시지!')
			    match = urlPattern.exec(msg.msg);
			    if(match != null && match.length>1){
			    	var text = match[0];
			    	og(text, function(err, meta){
					    io.sockets.to(socket.room).emit('my message url', msg, meta);
			    	});
			    }else{
				    io.sockets.to(socket.room).emit('my message', msg);
			    }
			}else{
				console.log('데이터 들어옴!')
				Data.findOne({'room_name':socket.room,'send_id':room.messagelog[index].email, 'name':msg.msg }, function(err, data){
		    		if(err) console.log(err);
		    		if(data != null){
		    			io.sockets.to(socket.room).emit('my data', data, room.messagelog[index].email, room.messagelog[index].name);
		    		}
		    	});
			}
		}else{
			if(msg.type != 'data'){
			    match = urlPattern.exec(msg.msg);
			    if(match != null && match.length>1){
			    	var text = match[0];
			    	og(text, function(err, meta){
						socket.broadcast.to(socket.room).emit('other message url', msg, meta);
			    	});
			    }else{
					socket.broadcast.to(socket.room).emit('other message', msg);
			    }
			}else{
				Data.findOne({'send_id':msg.me, 'file_name':msg.msg }, function(err, data){
		    		if(err) console.log(err);
		    		
		    		if(data != null){
		    			socket.broadcast.to(socket.room).emit('other data', data, room.messagelog[index].email, room.messagelog[index].name);
		    		}
		    	});				
				
			}
		}
		
	}
}
//you could use e.g. underscore to achieve this (
//function findUserByName(name){
//  for(socketId in nickNames){
//    if(nickNames[socketId] === name){
//      return socketId;
//    }
//  }
//  return false;
//}
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