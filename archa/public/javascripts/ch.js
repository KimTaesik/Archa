var socket;
$(document).ready(function() {
	function bytesToSize(bytes) {
	    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	    if (bytes == 0) return 'n/a';
	    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	    if (i == 0) return bytes + ' ' + sizes[i];
	    return (bytes / Math.pow(1024, i)).toFixed(1) + '' + sizes[i];
	};
	
    function me(msg){
        console.log(msg.msg.length);
        var msglength = msg.msg.length;
        var text= '<div class="message_box_send">\
                                <div id="me_image" class="message_sender"></div>\
                                <div class="talk me"><div id="talkname">'+msg.me+'</div></br>'+msg.msg+'</div>\
                          </div></br>';
        return text;
  }

	
	function other(msg){
		return '<div class="message_box_re">\
					<div id="other_image" class="message_re"></div>\
					<div class="talk other"><div id="talkother">'+msg.me+'</div><br>'+msg.msg+'</div>\
				</div></br>';
	}
	
	function myYoutube(msg,meta){
		return '<div class="message_box_send">\
					<a id="'+msg.me+'" class="message_sender">'+msg.me+'</a>\
					<p class="talk me">'+msg.msg+'</p>\
				</div>\
				<iframe class="talk me url"\
					src="'+meta.video.url[0]+'"\
					frameborder="0" allowfullscreen>\
				</iframe>';
	}
	function otherYoutube(msg,meta){
		return '<div class="message_box_re">\
					<a id='+msg.me+' class="message_re">'+msg.me+'</a>\
					<p class="talk other">'+msg.msg+'</p>\
				</div>\
				<iframe class="talk other url"\
					src="'+meta.video.url[0]+'"\
					frameborder="0" allowfullscreen>\
				</iframe>';
	}
	
	function myUrl(msg,meta){
		var text =  '<div class="message_box_send">\
						<a id='+msg.me+' class="message_sender">'+msg.me+'</a>\
						<p class="talk me">'+msg.msg+'</p>\
					</div>\
					<div class="talk me url">\
						<a  href="'+meta.url+'" target="_blank">\
							<img class="imgUrl" src="'+meta.image.url+'"/>\
							<span style="float:right;" >'+meta.description+'</span>\
						</a>\
					</div>';
		return text;
		
	}
	function otherUrl(msg,meta){
		return '<div class="message_box_re">\
					<a id='+msg.me+' class="message_re">'+msg.me+'</a>\
					<p class="talk other">'+msg.msg+'</p>\
				</div>\
				<div class="talk other url"> \
					<a href="'+meta.url+'" target="_blank">\
						<img class="imgUrl" src="'+meta.image.url+'"/>\
						<span style="float:left;" >'+meta.description+'</span>\
					</a>\
				</div>';
	}

	function myData(data,send_userEmail,send_userName){
		return '<div class="message_box_send sendData">\
						<a id='+send_userEmail+' class="message_sender">'+send_userName+'</a>\
						<a href="'+data.url+'" target="'+data.url+'"> \
						<div class="file_container"> \
							<h4 class="file_name" >'+data.name+'</h4> \
							<span class="meta_size" >'+bytesToSize(data.size)+'</span> \
							<span class="meta_rtype" >'+data.rtype+'</span>\ 
						</div>\
					</a>\
				</div>';
	}
	
	function otherData(data,re_userEmail,re_userName){
		return '<div class="message_box_re reData">\
						<a id='+re_userEmail+' class="message_re">'+re_userName+'</a>\
						<a href="'+data.url+'" target="'+data.url+'"> \
						<div class="file_container"> \
							<h4 class="file_name" >'+data.name+'</h4> \
							<span class="meta_size" >'+bytesToSize(data.size)+'</span> \
							<span class="meta_rtype" >'+data.rtype+'</span>\
						</div>\
					</a>\
				</div>';
	}
	
	function myImage(data,send_userEmail,send_userName){
		return '<div class="message_box_send sendData">\
		 <div id="me_image" class="message_sender"></div>\
		 <div class="myimage me"><div id="imagename">'+send_userName+'</div></br>\
			<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" class="dataImage" data-link-url="'+data.url+'">\
			<div class="dataImageBody">\
				<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'">\
			</div>\
		</a>\
		 </div>\
				</div></br>';
	}

	function otherImage(data,re_userEmail,re_userName){
		return '<div class="message_box_re reData">\
				<div id="other_image" class="message_re"></div>\
		 		<div class="otherimage me"><div id="otherimagename">'+re_userName+'</div></br>\
					<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" style="width: 50%;" class="image_file_body" data-link-url="'+data.url+'">\
						<div class="image_preserve_aspect_ratio">\
							<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'"\>\
						</div>\
					</a>\
				</div></div></br>';
	}
	
	socket = io.connect();
	socket.emit('myId', $('.myInfoView').attr("id"));
	
	socket.on('my message', function (msg) {
		$('#messages').append(me(msg));
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	
	socket.on('other message', function (msg) {
		$('#messages').append(other(msg));
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});

	socket.on('my message youtube', function(msg,meta){
		var me = $("#userId").val();
		if(me == msg.me){
			$('#messages').append(myYoutube(msg,meta));
			$('#messages').scrollTop($('#messages').prop('scrollHeight'));
		}		
	});
	
	socket.on('other message youtube', function(msg, meta){
		$('#messages').append(otherYoutube(msg,meta));
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	
	socket.on('my message url', function (msg,meta) {
		var me = $("#userId").val();
		if(me == msg.me){
			$('#messages').append(myUrl(msg,meta));
			$('#messages').scrollTop($('#messages').prop('scrollHeight'));
		}
	});
	
	socket.on('other message url', function (msg,meta) {
		$('#messages').append(otherUrl(msg,meta));
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});

	socket.on('my data', function(data,send_userEmail,send_userName){
		var mdata;
		if(data.rtype != 'image'){
			mdata = myData(data,send_userEmail,send_userName);
		}else{
			mdata = myImage(data,send_userEmail,send_userName);
		}
		$('#messages').append(mdata);
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	
	socket.on('other data', function(data,send_userEmail,send_userName){
		var odata;
		if(data.rtype != 'image'){
			odata = otherData(data,send_userEmail,send_userName);
		}else{
			odata = otherImage(data,send_userEmail,send_userName);
		}
		$('#messages').append(odata);
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	
	
	/* 채팅방 인원 목록 수정 2016_11_25 NA */
	socket.on('usercount', function(users,thisRoom, name){
		$('.dropdown').show();
		$('#room-image').text(users.length);
		$('#users').empty();
		$('.userInfo').empty();
		$('#room').val(name);
		$('#thisRoom').val(thisRoom);
		$('#joinRoom').val(thisRoom);
		/*$('.userInfo').append('<div id="invite"><a id="invitea">INVITE</a></div>');*/     /*  추가  */
		/*$('.userInfo').append('<button type="button" class="'+users[0]+'" id="chativ" data-toggle="modal" data-target="#myModal">invite</button>'); */    /*  추가  */
		$('.userInfo').append('<div class="'+users[0]+'" id="chativ">invite</div>');     /*  추가  */  
		users.forEach(function(users, index){
			if(users == $('.myInfoView').attr("id")) $('#me').val(users);
			else $('#you').val(users);
			text = '<li role="presentation"><a role="menuitem" tabindex="-1" data-target="#">'+users+'</a></li>'
			$('.userInfo').append(text);
		});
        $('.userInfo').append('<div id="close"><a>CLOSE</a></div>');	    /*  추가  */
        
        
/*	socket.on('usercount', function(users,thisRoom, name){
		$('.dropdown').show();
		$('#roomInfo').text(users.length);
		$('#users').empty();
		$('.userInfo').empty();
		$('#room').val(name);
		$('#thisRoom').val(thisRoom);
		$('#joinRoom').val(thisRoom);
		users.forEach(function(users, index){
			if(users == $('.myInfoView').attr("id")) $('#me').val(users);
			else $('#you').val(users);
			
			$('.userInfo').append('<li role="presentation"><a role="menuitem" tabindex="-1" data-target="#">'+users+'</a></li>');
		});*/
	});

	socket.on('rooms', function(rooms, moment) {
        $('#room-list').empty();
        var text;
        var pasttime;
        var time;
        var nowtime;
        rooms.forEach(function(room, index){
            if (room != '') {
            	time = new Date();
            	var hour =time.getHours();
            	var min =time.getMinutes();
            	pasttime = (room.messagelog[room.messagelog.length-1].mdate).substring(11,16);
            	text = '    <div class="myRoom" id="'+room.roomname+'"><div class="myRoom-img"></div>\
            				<div class="roomname">'+room.roomname+'</div>\
            				<div class="roomtext">'+room.messagelog[room.messagelog.length-1].message+'</div>	\
            				<div class="roomtime">'+pasttime+'</div>\
            				<div class="circle">'+room.users.length+'</div></div>';
                $('#room-list').append(text);
            }		        	
        });
    });
    
    //상단바 여기서 조정 후 멤버들에게 방 재입장 보냄
    // socket.join(new)
    socket.on('roomChange', function(thisRoom, users, name){
    	$('.dropdown').show();
		$('#roomInfo').text(users.length);
		$('#users').empty();
		$('.userInfo').empty();
		$('#room').val(name);
		$('#thisRoom').val(thisRoom);
		$('#joinRoom').val(thisRoom);
		users.forEach(function(users, index){
			if(users == $('.myInfoView').attr("id")) $('#me').val(users);
			else $('#you').val(users);
			
			$('.userInfo').append('<li role="presentation"><a role="menuitem" tabindex="-1" data-target="#">'+users+'</a></li>');
		});
    	socket.emit('roomChange', thisRoom);
    });
	
	socket.on('refresh', function(roomId, msg, messageDate){
			
		if( $('[id="'+roomId+'"]').length > 0){
			$('[id="'+roomId+'"]').children("h4").text('마지막 : '+msg);
			$('[id="'+roomId+'"]').children("h5").text(messageDate);
		}
	});
	
	
});
