
$(document).ready(function() {
	
			$('#leftSection').css('height' ,  $(window).height() );
			$('.msgbox').css('height' ,  $(window).height()-75 );
			$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -10);
			$('.searchResult,#room-list').css('height' ,  $(window).height()-$('#setGroup').height()-$('.menuTop').height()-$('.memberSection').height()-$('.myInfo').height()-$('.nav').height() );
			
			$(window).resize(function() {
				$('#leftSection').css('height' ,  $(window).height());
				$('.msgbox').css('height' ,  $(window).height()-75 );
				$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-10);
				$('.searchResult,#room-list').css('height' ,  $(window).height()-$('#setGroup').height()-$('.menuTop').height()-$('.memberSection').height()-$('.myInfo').height()-$('.nav').height() );
				if($('#rightSection').width()>10){
					$('#rightSection').css('width' ,  185 );
					$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-10 );
					$('#rightSection').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-20);
					$('#rightContent').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-$('#myTab').height()-30);
				}
			});

			function bytesToSize(bytes) {
			    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			    if (bytes == 0) return 'n/a';
			    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			    if (i == 0) return bytes + ' ' + sizes[i];
			    return (bytes / Math.pow(1024, i)).toFixed(1) + '' + sizes[i];
			};
			
		    $('.mid').on("click","#fileSend", function(event) {
		    	event.preventDefault();
		    	
		        var data = new FormData();
		        data.append('roomName', $('#thisRoom').val());
		        data.append('you', $('#you').val());
		        var filesList = document.getElementById('file');
		        
		        for (var i = 0; i < filesList.files.length; i ++) {
		            data.append('userfile', filesList.files[i]);
		        }
		        
		        $.ajax({
		            url			:	"/fileSend",
		            processData	:	false,
		            type		:	'POST',
		            contentType	:	false,
		            data		:	data,
		            datatype	:	"json",
		            success		:	function(data,status,xhr){
		            	socket.emit('dataInfoSend', data,$(".myInfoView").attr('id'),$("#userId").val());
		            }
		        });
		    });
		    
		    $('#leftSection').on('click','#myInfoConfirm', function(e){
		    	event.preventDefault();
		    	var company = $('#myCompany').val();
		    	var position = $('#position').val();
		    	var phoneNumber = $('#phoneNumber').val();
		        $.ajax({
		            type: "post",
		            url: "/updateMyInfo",
		            data: {"myCompany":company,"position":position,"phoneNumber":phoneNumber},
		            success: function(result,status,xhr){
		            	$("#leftSection").html(result);	
		            },
		            error: function(xhr, status, er){}
		        });		    	
		    });
	
		    $('#leftSection').on('click','#searchFriendBtn', function( event ) {
		    	event.preventDefault();
		    	var search = $("#inputSearchMember").val();
		        $.ajax({	
		            type: "post",
		            url: "/searchFriend",
		            data: { "inputSearchMember": search },
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result)
		            },
		            error: function(xhr, status, er){}
		        });
		    });
		    
		    $('#myTab a:last').tab('show');
		    
		    $('.topSection').on('click', '#searchSec', function(e){
		    	e.preventDefault();
		    	$('#rightSection').css('width' ,  185 );
		    	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-10 );
		    	$('#rightSection').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-20);
		    	
		        $.ajax({
		            type: "post",
		            url: "/search",
		            success: function(result,status,xhr){
		            	$('#rightSection').html(result);
		            	$('#rightContent').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-$('#myTab').height()-30);
		            },
		            error: function(xhr, status, er){}
		        });
		    });
		    $('#rightSection').on('click','#rigthClose', function(){
		    	$('#rightSection').empty();
		    	$('#rightSection').css('width' , 0);
		    	$('#rightSection').css('height', 0);
		    	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() );
		    });
		    
		    $('.topSection').on('click', '#archive', function(e){
		    	$('#rightSection').css('width' ,  185 );
		    	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-10 );
		    	$('#rightSection').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-20);
		    	e.preventDefault();
		    	var room = $('#thisRoom').val();
		        $.ajax({
		            type: "post",
		            url: "/archive",
		            data: { "room":room },
		            success: function(result,status,xhr){
		            	$('#rightSection').html(result);
		            	$('#rightContent').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-$('#myTab').height()-30);
		            },
		            error: function(xhr, status, er){}
		        });
		    });
		    
/*		    $('#rightSection').on( "click", "#fileMessageFind", function( event ) {
		    	event.preventDefault();
		    	var search = $("#fileMessageInput").val();
		    	var room = $('#thisRoom').val();
		    	var url = $("ul#myTab li.active").attr('id');
		    	var div;
		    	if(url=='searchMessage'){
		    		div = $('#messageSec');
		    	}else{
		    		div = $('#fileSec');
		    	}
		 
		        $.ajax({
		            type: "post",
		            url: "/"+url,
		            data: { "inputSearchRight": search, "room":room },
		            success: function(result,status,xhr){
		            	div.html(result);
		            },
		            error: function(xhr, status, er){}
		        });
		    });*/
		    
			$('#rightSection').on("keyup", "#fileMessageInput",function(key){
				if($("#fileMessageInput").val()){
					if(key.keyCode==13){
				    	var search = $("#fileMessageInput").val();
				    	var room = $('#thisRoom').val();
				    	var url = $("ul#myTab li.active").attr('id');
				    	var div;
				    	if(url=='searchMessage'){
				    		div = $('#messageSec');
				    	}else{
				    		div = $('#fileSec');
				    	}
				 
				        $.ajax({
				            type: "post",
				            url: "/"+url,
				            data: { "inputSearchRight": search, "room":room },
				            success: function(result,status,xhr){
				            	div.html(result);
				            },
				            error: function(xhr, status, er){}
				        });					  
					}
				}
			});		    
		    
		    
			$("#inputMe").keyup(function(key){
				if($("#inputMe").val()){
				  if(key.keyCode==13){
					var message = {
							email : $(".myInfoView").attr('id'),
					        me  : $("#userId").val(),
					        msg: $("#inputMe").val()
					};
				    socket.emit('message', message);
				    $("#inputMe").val("");
				  }
				}
			});
			
			$('#rightSection').on("keyup", "#fileInput",function(key){
				if($("#fileInput").val()){
					if(key.keyCode==13){
				    	var search = $("#fileInput").val();
				    	var room = $('#thisRoom').val();
				    	var url = $("ul#myTab li.active").attr('id');
				    	var div;
				    	
				    	if(url=='sendFile'){
				    		div = $('#send');
				    	}else{
				    		div = $('#receive');
				    	}
				 
				        $.ajax({
				            type: "post",
				            url: "/"+url,
				            data: { "input": search, "room":room },
				            success: function(result,status,xhr){
				            	div.html(result);
				            }
				        });						  
					}
				}
			});
			
/*		    $('#rightSection').on( "click", "#fileFind", function( event ) {
		    	event.preventDefault();
		    	var search = $("#fileInput").val();
		    	var room = $('#thisRoom').val();
		    	var url = $("ul#myTab li.active").attr('id');
		    	var div;
		    	
		    	if(url=='sendFile'){
		    		div = $('#send');
		    	}else{
		    		div = $('#receive');
		    	}
		 
		        $.ajax({
		            type: "post",
		            url: "/"+url,
		            data: { "input": search, "room":room },
		            success: function(result,status,xhr){
		            	div.html(result);
		            },
		            error: function(xhr, status, er){}
		        });
		    });	*/
		    
		    $('#leftSection').on("click","#searchAllBtn",function(e) {
		    	var search = $("#inputAll").val();
		        $.ajax({
		            type: "post",
		            url: "/allUser",
		            data: { "inputAll": search },
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result)
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
		    });
		    
		    $('#leftSection').on("click","#getFriendList",function(e) {
		    	var search = $("#inputAll").val();
		        $.ajax({
		            type: "post",
		            url: "/getFriend",
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result)
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
		    });
		    
		    $('#leftSection').on("click",".friendAdd",function(e) {
		    	var email = $(this).attr("id");
		        $.ajax({
		            type: "post",
		            url: "/addFriend",
		            data: { "email": email },
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result)
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
		    });	   
		    
		    $('#leftSection').on("click",".friendDelete",function(e) {
		    	var email = $(this).attr("id");
		        $.ajax({
		            type: "post",
		            url: "/deleteFriend",
		            data: { "friend": email },
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result)
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
		    });	 
		    
			$('#leftSection').on("click","#myMenu",function(e){
		        $.ajax({
		            type: "post",
		            url: "/mypage",
		            success: function(result,status,xhr){
		            	$("#leftSection").html(result);
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
			});
			
			$('#leftSection').on("click","#addGroup",function(e){
				var name = $('#groupname').val();
				$('#groupname').val('');
		        $.ajax({
		            type: "post",
		            url: "/addGroup",
		            data:{ "groupName":name },
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result)
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
			});
			
			$('#leftSection').on('click', "#deleteGroup", function(e){
				var name = $('#settLabel').text();
		        $.ajax({
		            type: "post",
		            url: "/deleteGroup",
		            data: { "groupName": name },
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result);
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
			});
			
			$("#inputMe").keyup(function(key){
				if($("#inputMe").val()){
				  if(key.keyCode==13){
					var message = {
							email : $(".myInfoView").attr('id'),
					        me  : $("#userId").val(),
					        msg: $("#inputMe").val()
					};
				    socket.emit('message', message);
				    $("#inputMe").val("");
				  }
				}
			});
	      
			$("#btnSend").click(function(){
				var email = $(".myInfoView").attr('id');
				var me = $("#userId").val();
				if($("#inputMe").val()){
				    var message = {
				    		type	: 'text',
				    		email	: email,
				            me		: me,
				            msg		: $("#inputMe").val()
				    };
					socket.emit('message', message);
					$("#inputMe").val("");
				}
			});
			
			$( "#leftSection" ).on( "dblclick", "li", function( event ) {
			    event.preventDefault();
			    var you = $(this).attr("id");
			    var me = $('.myInfoView').attr("id");
			    var room = {
			    		you : you,
			    		me : me
			    }
			    
		        $.ajax({
		            type: "post",
		            url: "/joinChat",
		            success: function(result,status,xhr){
		            	$(".background").html(result);
					    $("#messages").empty();
					    socket.emit('join', room, me);		            	
		            },
		            error: function(xhr, status, er){}
		        });

			});
			
			$( "#leftSection" ).on( "click", ".chatbtn", function( event ) {
			    event.preventDefault();
			    var you = $(this).attr("id");
			    var me = $('.myInfoView').attr("id");
			    var room = {
			    		you : you,
			    		me : me
			    }
			    $("#messages").empty();
			    socket.emit('join', room, me);
			});
			
		    $('#leftSection').on("click","#getRoomList",function(){
				setInterval(function() {
					socket.emit('rooms', $('.myInfoView').attr("id"));
			    }, 10000);
		    });
			
			$('#leftSection').on('click', "#setGroup", function(e){
				$('#nameModal').modal();
			});
			
			$('#leftSection').on('click', ".setting", function(e){
				var id = $(this).attr("id");
				$('#settLabel').text(id);
		        $.ajax({
		            type: "post",
		            url: "/setGroup",
		            data : { "groupName" : id },
		            success: function(result,status,xhr){
		            	$('#settModal').modal();
		            	$("#setBody").html(result);
		            	
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
			});
			
			//+눌럿을때 뜨는 뷰
			$('#leftSection').on('click', ".addUser", function(e){
				var id = $(this).attr("id");
				$('#settLabel').text(id);
		        $.ajax({
		            type: "post",
		            url: "/addUser",
		            data : { "groupName" : id },
		            success: function(result,status,xhr){
		            	$('#settModal').modal();
		            	$("#setBody").html(result);
		            	
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
			});
			
			$('#leftSection').on('click', "#addGroupUser", function(e){
				$.ajaxSettings.traditional = true;
				var arrayParam = new Array();
				var name = $('#settLabel').text();

				$("input:checkbox[id=chUser]:checked").each(function(){
					arrayParam.push($(this).val());
					$(this).hide();
				});
				
		        $.ajax({
		            type: "post",
		            url: "/addChkUser",
		            data : { "ids" : arrayParam, "groupName": name },
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result);	
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
			});	
			
			$('#leftSection').on('click', ".groupOut", function(e){
				var id = $(this).attr("id");
				var name = $('#settLabel').text();
		        $.ajax({
		            type: "post",
		            url: "/groupOut",
		            data : { "email" : id, "groupName":name },
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result);
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
			});		
			
			$('#leftSection').on('dblclick', ".myRoom", function(e){
				$("#messages").empty();
				var roomName = $(this).attr("id");
				var me = $("#userId").val();
				socket.emit('rejoin', roomName,me);
			});
			
			$('#leftSection').on('click', "#myMenuOut",function(e){
		        $.ajax({
		            type: "post",
		            url: "/leftmenu",
		            success: function(result,status,xhr){
		            	$("#leftSection").html(result)
		    		    $('#leftSection').css('height' ,  $(window).height() );
		    		    $('.searchResult,#room-list').css('height' ,  $(window).height()-$('#setGroup').height()-$('.menuTop').height()-$('.memberSection').height()-$('.myInfo').height()-$('.nav').height() );
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();					
			});
			
			$('#leftSection').on('click', '#myInfoEdit',function(e){
				if($('#myCompany').is('[disabled=disabled]')){
					if(confirm("수정하시겠습니까?") == true){
						$('#myCompany, #position, #phoneNumber').attr("disabled",false);
						$(this).hide();
						$('#myInfoConfirm').show();
					}
				}				
			});
			
			$('#leftSection').on('click', '#signOutBtn',function(){
				$('div.modal').modal();
			});
			
			$('#leftSection').on('click', '#fname', function(e){
				e.preventDefault();
				var femail = $(this).attr("class");
		        $.ajax({
		            type: "post",
		            url: "/friendInfo",
		            data : { "friend" : femail },
		            success: function(result,status,xhr){
		            	$("#friendInfoModal").html(result);
		            	$("#friendInfoModal").modal();
//		            	$(".infoModal").modal();
		            },
		            error: function(xhr, status, er){}
		        });
			})
			
		});