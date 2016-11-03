var User = require('../models/user.js');
var StorageList = require('../models/storagelist.js');

exports.savelist = function(roomName,sendId,receId,dataUrl,fileName,size,type,rtype){
	var slist = new StorageList({
		'room_name'	:	roomName,
		'url'		:	dataUrl,
		'name'		:	fileName,
		'size'		:	size,
		'type'		: 	type,
		'rtype'		:	rtype,
		'date'		:	new Date
	});
	User.findOne({email:sendId},"email name position company phoneNumber", function(err, senduser){
		User.findOne({email:receId},"email name position company phoneNumber", function(err, receuser){
			slist.send_id = senduser;
			slist.rece_id = receuser;
			
			slist.save(function(err){
				if(err){
					console.log(err);
				}
			});
		});
	});

}