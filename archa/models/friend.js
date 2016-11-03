var mongoose = require('mongoose');

var friend = mongoose.Schema({
	friend :{ type : mongoose.Schema.Types.ObjectId, require : true, ref : 'user' }, 
	groupname:{ type:String, required:true, "default":'default' },
	"_id": false
});

var friend = mongoose.model('friend',friend);

module.exports = friend;
