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
        var msglength = msg.msg.length;
        var text= '<div class="message_box_send">\
                                <div id="me_image" class="message_sender"></div>\
                                <div class="talk me"><div id="talkname">'+msg.me+'</div></br>'+msg.msg+'</div>\
                          </div></br>';
        return text;
	}
    function nearMe(msg){
        var msglength = msg.msg.length;
        var text= '<div class="message_box_send">\
                                <div class="talk me">'+msg.msg+'</div>\
                          </div></br>';
        return text;
	}	
	function other(msg){
		return '<div class="message_box_re">\
					<div id="other_image" class="message_re"></div>\
					<div class="talk other"><div id="talkother">'+msg.me+'</div><br>'+msg.msg+'</div>\
				</div></br>';
	}
	function nearOther(msg){
		return '<div class="message_box_re">\
					<div class="talk other">'+msg.msg+'</div>\
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
							<span class="meta_size" >'+bytesToSize(data.size)+'</span>\
							<span class="meta_rtype" >'+data.rtype+'</span>\
						</div>\
					</a>\
				</div>';
	}
	function nearMyData(data,send_userEmail,send_userName){
		return '<div class="message_box_send sendData">\
					<a id='+send_userEmail+' class="message_sender">'+send_userName+'</a>\
						<a href="'+data.url+'" target="'+data.url+'"> \
						<div class="file_container"> \
							<h4 class="file_name" >'+data.name+'</h4> \
							<span class="meta_size" >'+bytesToSize(data.size)+'</span>\
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
	function nearMyImage(data,send_userEmail,send_userName){
		return '<div class="message_box_send sendData">\
					 <div class="myimage me"></br>\
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
	function nearOtherImage(data,re_userEmail,re_userName){
		return '<div class="message_box_re reData">\
			 		<div class="otherimage me"></br>\
						<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" style="width: 50%;" class="image_file_body" data-link-url="'+data.url+'">\
							<div class="image_preserve_aspect_ratio">\
								<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'"\>\
							</div>\
						</a>\
					</div>\
				</div></br>';
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
	
	socket.on('roomLoad', function(email, room,data){
		var msg;
		var mdata, odata;
		var chk;
		var temp;
		room.messagelog.forEach(function(val, i){
			if(i!=0){
				var testDate = new Date(val.mdate);
				var tempDate = new Date(temp.mdate);
				var cal = new Date(testDate-tempDate);
			}
			if(val.mtype == 'text'){
				msg = {
					email : val.email,
					me : val.name,
					msg : val.message
				}
				if(val.email == email){
					if(i!=0 && val.email == temp.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
						$('#messages').append(nearMe(msg));
						$('#messages').scrollTop($('#messages').prop('scrollHeight'));						
					}else{
						$('#messages').append(me(msg));
						$('#messages').scrollTop($('#messages').prop('scrollHeight'));
					}
				}else{
					if(i!=0 && val.email == temp.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
						$('#messages').append(nearOther(msg));
						$('#messages').scrollTop($('#messages').prop('scrollHeight'));						
					}else{
						$('#messages').append(other(msg));
						$('#messages').scrollTop($('#messages').prop('scrollHeight'));								
					}
				}
			}else if(val.mtype == 'data'){
				if(val.email == email){
					$.each(data, function(j, dv){
						if(dv.name == val.message && dv.send_id.email == val.email && dv.date == val.mdate){
							if(i!=0 && val.email == temp.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
								if(dv.rtype == 'image'){
									mdata = nearMyImage(dv, dv.send_id.email, dv.send_id.name);
								}else{
									mdata = nearMyData(dv, dv.send_id.email, dv.send_id.name);
								}
								$('#messages').append(mdata);
								$('#messages').scrollTop($('#messages').prop('scrollHeight'));								
							}else{
								if(dv.rtype == 'image'){
									mdata = myImage(dv, dv.send_id.email, dv.send_id.name);
								}else{
									mdata = myData(dv, dv.send_id.email, dv.send_id.name);
								}
								$('#messages').append(mdata);
								$('#messages').scrollTop($('#messages').prop('scrollHeight'));								
							}					
						}
					});
				}else{
					$.each(data, function(j, dv){
						if(dv.name == val.message && dv.rece_id.email == val.email && dv.date == val.mdate){
							if(i!=0 && val.email == temp.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
								if(dv.rtype == 'image'){
									odata = nearOtherImage(dv, dv.rece_id.email, dv.rece_id.name);
								}else{
									odata = otherData(dv, dv.rece_id.email, dv.rece_id.name);
								}
								$('#messages').append(odata);
								$('#messages').scrollTop($('#messages').prop('scrollHeight'));									
							}else{
								if(dv.rtype == 'image'){
									odata = otherImage(dv, dv.rece_id.email, dv.rece_id.name);
								}else{
									odata = otherData(dv, dv.rece_id.email, dv.rece_id.name);
								}
								$('#messages').append(odata);
								$('#messages').scrollTop($('#messages').prop('scrollHeight'));								
							}
						}
					});
				}
			}else if(val.mtype == 'url'){
				msg = {
					email : val.email,
					me : val.name,
					msg : val.message,
					url : val.url
				}
				if(val.email == email){
					$('#messages').append(myUrlHead(msg,i));
					$('#messages').scrollTop($('#messages').prop('scrollHeight'));
					socket.emit('getOgData', msg.url, msg.email,i);
				}else{
					$('#messages').append(otherUrlHead(msg,i));
					$('#messages').scrollTop($('#messages').prop('scrollHeight'));
					socket.emit('getOgData', msg.url, msg.email,i);					
				}
			}
			if(jQuery.inArray(email,val.readby) == -1){
				chk = 1;
				val.readby.push(email);
			}
			temp = val;
		});
		if(chk){
			socket.emit('readMessageSave', room);
			if( $('[id="'+room.id+'"]').length > 0){
				$('[id="'+room.id+'"]').text('');
			}
		}
	});

	socket.on('ogData', function(meta,url, sendEmail, me,i){
		if(sendEmail == me){
			$('#messages').children('[id="'+i+'"]').append(myUrlMeta(meta));
		}else{
			$('#messages').children('[id="'+i+'"]').append(otherUrlMeta(meta));
		}
	});
	socket.on('youOgData', function(meta, url, sendEmail, me, i){
		if(sendEmail == me){
			$('#messages').children('[id="'+i+'"]').append(myYoutubeMeta(meta));
		}else{
			$('#messages').children('[id="'+i+'"]').append(otherYoutubeMeta(meta));
		}	
	});
	function myUrlHead(msg,i){
		var text =  '<div class="message_box_send" id='+i+'>\
						<a id='+msg.me+' class="message_sender">'+msg.me+'</a>\
						<p class="talk me">'+msg.msg+'</p>\
					</div>';
		return text;
		
	}
	function myUrlMeta(meta){
		var text =  '<div class="talk me url">\
						<a  href="'+meta.url+'" target="_blank">\
							<img class="imgUrl" src="'+meta.image.url+'"/>\
							<span style="float:right;" >'+meta.description+'</span>\
						</a>\
					</div>';
		return text;
	}
	
	function otherUrlHead(msg,i){
		return '<div class="message_box_re" id='+i+'>\
					<a id='+msg.me+' class="message_re">'+msg.me+'</a>\
					<p class="talk other">'+msg.msg+'</p>\
				</div>';
	}
	function otherUrlMeta(meta){
		return '<div class="talk other url"> \
					<a href="'+meta.url+'" target="_blank">\
						<img class="imgUrl" src="'+meta.image.url+'"/>\
						<span style="float:left;" >'+meta.description+'</span>\
					</a>\
				</div>';
	}
	function myYoutubeMeta(meta){
		return '<iframe class="talk me url"\
					src="'+meta.video.url[0]+'"\
					frameborder="0" allowfullscreen>\
				</iframe>';
	}
	function otherYoutubeMeta(meta){
		return '<iframe class="talk other url"\
					src="'+meta.video.url[0]+'"\
					frameborder="0" allowfullscreen>\
				</iframe>';
	}	
	
	
	
	
	
	
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
        
	});

	socket.on('rooms', function(rooms, roomName, me) {
        $('#room-list').empty();
        var text;
        var pasttime;
        var time;
        var nowtime;
        var count = 0;
        rooms.forEach(function(room, index){
            if (room != '') {
            	room.messagelog.forEach(function(log,index){
            		if(jQuery.inArray(me,log.readby) == -1) count++;
            	});
                
            	roomName.roomName.forEach(function(name, index){
            		if(name.roomId == room.id){
	                	time = new Date();
	                	var hour =time.getHours();
	                	var min =time.getMinutes();
	                	pasttime = (room.messagelog[room.messagelog.length-1].mdate).substring(11,16);
	                	text = '    <div class="myRoom" id="'+room.id+'"><div class="myRoom-img"></div>\
	                				<div class="roomname">'+name.rName+'</div>\
	                				<div class="roomtext">'+room.messagelog[room.messagelog.length-1].message+'</div>	\
	                				<div class="roomtime">'+pasttime+'</div>\
	                				<div class="circle">'+room.users.length+'</div></div>';
	                    $('#room-list').append(text);
                	}       		
            	});
            	count = 0;
            }		        	
        });
    });
	socket.on('roomNameChange', function(roomId, newName){
		if( $('[id="'+roomId+'"]').length > 0){
			$('[id="'+roomId+'"]').children('.roomname').text(newName);
		}		
	});	
    // 방에 메시지 새로온거 뿌려줌
 	socket.on('refresh', function(roomId, msg, messageDate,room,me){
		var count = 0;	
		if( $('[id="'+roomId+'"]').length > 0){
			room.messagelog.forEach(function(log,index){
				if(jQuery.inArray(me,log.readby) == -1) count++;
			});
			$('[id="'+roomId+'"]').children('.roomtext').text(msg);
			$('[id="'+roomId+'"]').children('.roomtime').text(messageDate.substring(11,16));
/*			$('[id="'+roomId+'"]').text(count);*/
		}
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
	
	
});
