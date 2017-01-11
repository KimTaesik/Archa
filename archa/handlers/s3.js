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

exports.filesend = function(req, res){
	var user = req.session.user_id;
	var form = new formidable.IncomingForm();
	var s3 = new AWS.S3();

	form.parse(req, function(req, fields, files){
		var address = fields.you;
		var addr = address.split('@');
//		var bucketName = 'archa-'+addr[0]+'-'+addr[1];
		var bucketName = 'archa-bucket'
		var fileTypeTemp = files.userfile.name.split('.');
		var fileType = fileTypeTemp[1];
		var realTypeTemp = files.userfile.type.split('/');
		var realType = realTypeTemp[0];
//		console.log(files.userfile);
//		s3.createBucket({Bucket: bucketName}, function(err) {
//			if(err) console.log(err);

			var params = {
					Bucket: bucketName, 
					Key: address+'/'+files.userfile.name,
					Body: fs.createReadStream(files.userfile.path),
					ACL:'public-read'
				};
	
			s3.upload(params, function(err, data) {
			    if (err) console.log(err);
			    if(!data){
			    	
			    }else{
			    	Storage.savelist(fields.roomName, user.email, fields.you, data.Location, files.userfile.name, files.userfile.size, fileType, realType );
			    	var data = {
			    			name	: files.userfile.name,
			    			url		: data.Location,
//			    			url		: 'test',
			    			size	: files.userfile.size,
			    			type	: fileType,
			    			rtype	: realType
			    		}
			    	res.json(data);
				}
			});
//		});
	});
}

exports.userProfileImg = function(req, res, next){
	var user = req.session.user_id;
	var form = new formidable.IncomingForm();
	var s3 = new AWS.S3();
	
	form.parse(req, function(req, fields, files){
		var address = user.email;
		var bucketName = 'archa-bucket'
		var params = {
			Bucket: bucketName, 
			Key: address+'/userProfileImg/'+files.userfile.name,
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
exports.getList = function(req, res){
/*	console.log('test');
	var user = req.session.user_id.email;
	console.log(user);
	var s3 = new AWS.S3();
	var params = {
			  Bucket: 'archa-bucket',  required 
			  Delimiter: "/",
			  Prefix: user+"/"
			};
	console.log(params);
	s3.listObjectsV2(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else     console.log(data);           // successful response
	});*/
}
	