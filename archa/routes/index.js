var express = require('express');
var session = require('express-session');
var passport = require('passport');
var path = require('path');
var router = express.Router();

var account = require('../handlers/account.js');
var chat = require('../handlers/chat.js');
var room = require('../handlers/room.js');
var s3 = require('../handlers/s3.js');
var search = require('../handlers/search.js');
var myArchive = require('../handlers/myArchive.js');
var alarm = require('../handlers/alarm.js');

router.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Lapup');

var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error'));
db.once('open', function callback(){
	console.log("mongo db connection OK");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Archa' });
});

router.post('/login', account.login);

router.get('/logout', account.logout);
router.post('/mypage', account.mypage);
router.post('/leftmenu', account.leftmenu);
router.get('/userReg', account.userReg);
router.post('/register', account.register);
router.post('/updateMyInfo', account.updateMyInfo);
router.post('/signOutUser', account.signOutUser);
router.post('/allUser',account.allUser);
router.post('/addFriend',account.addFriend);
router.post('/searchFriend', account.searchFriend);
router.post('/deleteFriend', account.deleteFriend);
router.post('/getFriend', account.getFriend);
router.post('/friendInfo', account.friendInfo);

router.post('/profile', account.profile);
router.post('/profileEdit', account.profileEdit);

router.post('/roomList', room.roomlist);

router.post('/fileSend', s3.filesend);
router.post('/getList', s3.getList);
router.post('/userProfileImg', s3.userProfileImg);
router.post('/deleteFile', s3.deleteFile);

router.post('/searchMessage', search.messageSearch);
router.post('/searchfile', search.fileSearch);
router.post('/search', search.search);

/*router.post('/archive', search.archive);*/

router.post('/sendFile', search.sendFile);
router.post('/receiveFile', search.receiveFile);

router.get('/chatPage', chat.chatPage);
router.post('/addGroup', chat.addGroup);
router.post('/addUser', chat.addUser);
router.post('/setGroup', chat.setGroup);
router.post('/groupOut', chat.groupOut);
router.post('/addChkUser', chat.addChkUser);
router.post('/deleteGroup', chat.deleteGroup);
router.post('/joinChat', chat.joinChat);
router.post('/inviteRoom', chat.inviteRoom);
router.post('/inviteUserSearch', chat.inviteUserSearch);
router.post('/roomInfo', chat.roomInfo);

router.post('/myArchive', myArchive.myArchive);
router.post('/ALL', myArchive.ALL);
router.post('/ARCHIVE', myArchive.ARCHIVE);
router.post('/GALLERY', myArchive.GALLERY);
router.post('/tabgot', myArchive.tabgot);
router.post('/tabsent', myArchive.tabsent);

router.post('/alarm', alarm.alarm);
router.post('/findRelation', alarm.findRelation);
router.post('/tabReq', alarm.tabReq);
router.post('/tabNoti', alarm.tabNoti);
router.post('/findRelationUser', alarm.findRelationUser);
router.post('/connFriend', alarm.connFriend);

router.post('/roomArchive', search.roomArchive);
router.post('/roomGallery', search.roomGallery);
router.post('/roomLinks', search.roomLinks);

module.exports = router;
