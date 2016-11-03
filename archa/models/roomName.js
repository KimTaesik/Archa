var mongoose = require('mongoose');

var roomName = mongoose.Schema({
	roomId: String, 
	rName: String
});

var roomName = mongoose.model('roomName', roomName);

module.exports = roomName;