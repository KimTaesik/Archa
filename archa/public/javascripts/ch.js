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
		var text= '<div class="message_box_send">\
						<a id='+msg.me+' class="message_sender">'+msg.me+'</a>\
						<p class="talk me">'+msg.msg+'</p>\
					</div>';
		return text;
	}
	
	function other(msg){
		return '<div class="message_box_re">\
					<a id='+msg.me+' class="message_re">'+msg.me+'</a>\
					<p class="talk other">'+msg.msg+'</p>\
				</div>';
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
	function myImage(data,send_userEmail,send_userName){
		return '<div class="message_box_send sendData">\
					<a id='+send_userEmail+' class="message_sender">'+send_userName+'</a>\
					uploaded an image: <a href="'+data.url+'" target="'+data.url+'"> \
					<h6 class="file_preview_link_name">'+data.name+'</h6>\
					</a>\
					<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" class="dataImage" data-link-url="'+data.url+'">\
						<div class="dataImageBody">\
							<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'">\
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
	function otherImage(data,re_userEmail,re_userName){
		return '<div class="message_box_re reData">\
					<a id='+re_userEmail+' class="message_re">'+re_userName+'</a>\
					uploaded an image: <a href="'+data.url+'" target="'+data.url+'"> \
					<h6 class="file_preview_link_name">'+data.name+'</h6>\
					</a>\
					<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" style="width: 50%;" class="image_file_body" data-link-url="'+data.url+'">\
						<div class="image_preserve_aspect_ratio">\
							<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'"\>\
						</div>\
					</a>\
				</div>';
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
	
	socket.on('usercount', function(users,thisRoom, name){
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
	});

	socket.on('rooms', function(rooms, moment) {
        $('#room-list').empty();
        var text;
        rooms.forEach(function(room, index){
            if (room != '') {
            	text = '<div class="myRoom" id="'+room.roomname+'">\
            				<div class="circle">'+room.users.length+'</div>\
            				<h6>'+room.roomname+'</h6>\
            				<h4>마지막 : '+room.messagelog[room.messagelog.length-1].message+'</h4>	\
            				<h5>'+room.messagelog[room.messagelog.length-1].mdate+'</h5>\
            			</div><hr style="border: solid 1px #e2e2e2;"/>';
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
