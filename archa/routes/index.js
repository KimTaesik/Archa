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
  res.render('index', { title: 'Main' });
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


router.post('/roomList', room.roomlist);

router.post('/fileSend', s3.filesend);

router.post('/searchMessage', search.messageSearch);
router.post('/searchfile', search.fileSearch);
router.post('/search', search.search);
router.post('/archive', search.archive);
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

module.exports = router;
