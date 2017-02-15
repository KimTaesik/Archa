var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1';
AWS.config.endpoint = 's3-ap-northeast-1.amazonaws.com';
AWS.config.update({
    signatureVersion: 'v4'
});
var formidable = require('formidable');
var fs = require('fs');
var Storage = require('../DB/storage.js');
var User = require('../models/user.js');
var StorageList = require('../models/storagelist.js');
var Data = require('../models/storagelist.js');
var Message = require('../models/message.js');
var Room = require('../models/room.js');

exports.filesend = function(req, res){
	var user = req.session.user_id;
	var form = new formidable.IncomingForm();
	var s3 = new AWS.S3();

	form.parse(req, function(req, fields, files){
		var address = fields.you;
		var addr = address.split('@');
//		var bucketName = 'archa-'+addr[0]+'-'+addr[1];
		var bucketName = 'archa-bucket';
		var fileTypeTemp = files.userfile.name.split('.');
		var fileType = fileTypeTemp[1];
		var realTypeTemp = files.userfile.type.split('/');
		var realType = realTypeTemp[0];
//		console.log(files.userfile);
//		s3.createBucket({Bucket: bucketName}, function(err) {
//			if(err) console.log(err);

		    var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		    for( var i=0; i < 9; i++ ){
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    }

			var params = {
					Bucket: bucketName, 
					Key: address+'/'+text+'/'+files.userfile.name,
					Body: fs.createReadStream(files.userfile.path),
					ACL:'public-read'
				};
	
			s3.upload(params, function(err, data) {
			    if (err) console.log(err);
			    if(!data){
			    	
			    }else{
			    	console.log(fields.userList);
			    	var slist = new StorageList({
			    		'room_id'	:	fields.roomName,
			    		'url'		:	data.Location,
			    		'name'		:	files.userfile.name,
			    		'size'		:	files.userfile.size,
			    		'type'		: 	fileType,
			    		'rtype'		:	realType,
			    		'date'		:	new Date
			    	});
			    	console.log(slist)
			    	User.findOne({email:user.email},"email name position company phoneNumber", function(err, senduser){
			    		User.findOne({email:fields.you},"email name position company phoneNumber", function(err, receuser){
			    			slist.send_id = senduser;
			    			slist.rece_id = receuser;
			    			
			    			slist.save(function(err){
			    				if(err){
			    					console.log(err);
			    				}else{
			    					var message = new Message({
			    						mtype	: 'data',
			    						email	: senduser.email,
			    						name	: senduser.name,
			    						message : slist.name,
			    						mdate	: slist.date,
			    						readby  : fields.userList
			    					});
			    					
			    					Room.findOne({'id':slist.room_id},function(err, room){
			    						if(err) console.log(err);
			    						else {
			    							room.messagelog.push(message);
			    							room.save();
			    						}
			    					});
			    				}
			    			});
			    		});
			    	});			    	
			    			    	
/*			    	var testData = Storage.savelist(fields.roomName, user.email, fields.you, data.Location, files.userfile.name, files.userfile.size, fileType, realType );
			    	console.log('테스트데이타');
			    	console.log(testData);
			    	var data = {
			    			name	: files.userfile.name,
			    			url		: data.Location,
//			    			url		: 'test',
			    			size	: files.userfile.size,
			    			type	: fileType,
			    			rtype	: realType
			    		}*/
			    	res.json(slist);
				}
			});
//		});
	});
}
	

//테스트용
/*exports.filesend = function(req, res){
	var user = req.session.user_id;
	var form = new formidable.IncomingForm();
	console.log('서블릿 진입')
	form.parse(req, function(req, fields, files){
		var address = fields.you;
		var addr = address.split('@');
//		var bucketName = 'archa-'+addr[0]+'-'+addr[1];
		var bucketName = 'archa-bucket';
		var fileTypeTemp = files.userfile.name.split('.');
		var fileType = fileTypeTemp[1];
		var realTypeTemp = files.userfile.type.split('/');
		var realType = realTypeTemp[0];

	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	    for( var i=0; i < 9; i++ ){
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }

    	var slist = new StorageList({
    		'room_id'	:	fields.roomName,
    		'name'		:	files.userfile.name,
    		'size'		:	files.userfile.size,
    		'date'		:	new Date
    	});	    	
    	console.log(slist);
    	res.send(slist);
	});
}*/

exports.userProfileImg = function(req, res, next){
	var user = req.session.user_id;
	var form = new formidable.IncomingForm();
	var s3 = new AWS.S3();
	
	form.parse(req, function(req, fields, files){
		var address = user.email;
		var bucketName = 'archa-bucket'
		var params = {
			Bucket: bucketName, 
			Key: address+'/userProfileImg/user_profile_img.png',
/*			Key: address+'/userProfileImg/'+files.userfile.name,*/
			Body: fs.createReadStream(files.userfile.path),
			ACL:'public-read'
		};
		s3.upload(params, function(err, data) {
		    if (err) console.log(err);
		    if(!data){
		    	
		    }else{
		    	console.log(data);
		    	
				User.findOneAndUpdate({'email':user.email},{ $set : { 'user_img' : data.Location } },{upsert: true, 'new': true}
				).exec(function(err, user){
					res.send(user.user_img);
				});
			}
		});		
		
		
	});	
}
exports.deleteFile = function(req, res){
	var s3 = new AWS.S3();
	var url = req.body.url;
	console.log(url);
	var temp = url.split('/');
	console.log(temp)
	
	var user = req.session.user_id;
	var eTemp = user.email.split('@');
	var email = eTemp[0]+'%40'+eTemp[1];
	console.log(email);
	if(temp[3]==email){
	  var params = {
			    Bucket: 'archa-bucket',
			    Prefix: user.email+'/'+temp[4]
			  };
	  console.log(params);
	  s3.listObjects(params, function(err, data) {
	    if (err) console.log(err);

	    if (data.Contents.length == 0){
	    	res.send('오잉 삭제할 파일이 없네요');
	    }else{
		    params = {Bucket: 'archa-bucket'};
		    params.Delete = {Objects:[]};

		    data.Contents.forEach(function(content) {
		      params.Delete.Objects.push({Key: content.Key});
		    });

		    s3.deleteObjects(params, function(err, data) {
		      if (!err){
		    	  Data.remove({'url': url}).exec(function(err){
		    		  if(!err) res.send('삭제완료!');
		    	  });
		      }else{
		    	  console.log(err);
		      }
		      
/*		      if(data.Contents.length == 1000) '';
		      else res.send('삭제완료!');*/
		    });	    	
	    }

	  });
	}else{
		res.send('내가 보낸 파일은 삭제할 수 없습니다.');
	}
}
exports.getList = function(req, res){
}
	