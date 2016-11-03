var AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1';
AWS.config.endpoint = 's3-ap-northeast-1.amazonaws.com';
AWS.config.update({
    signatureVersion: 'v4'
});
var formidable = require('formidable');
var fs = require('fs');
var Storage = require('../DB/storage.js');

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
			console.log('address:'+address);

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
			    	console.log(data);
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
	