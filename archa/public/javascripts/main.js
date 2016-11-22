
$(document).ready(function() {
			
			$('#leftSection').css('height' ,  $(window).height() );
			$('.searchResult,#room-list').css('height' ,  $(window).height()-$('#setGroup').height()-$('.menuTop').height()-$('.memberSection').height()-$('.myInfo').height()-$('.nav').height() -67 );
			
			$(window).resize(function() {
				$('#leftSection').css('height' ,  $(window).height());
            	$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height());
            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -10);
            	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-20 );
				$('.searchResult,#room-list').css('height' ,  $(window).height()-$('#setGroup').height()-$('.menuTop').height()-$('.memberSection').height()-$('.myInfo').height()-$('.nav').height() -67);
				if($('#rightSection').width()>10){
					$('#rightSection').css('width' ,  185 );
	            	$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height());
	            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -10);
	            	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-20 );
					$('#rightSection').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-20);
					$('#rightContent').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-$('#myTab').height()-30);
				}
			});
			
			/*
			 * 파일 크기 계산
			 */
			function bytesToSize(bytes) {
			    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			    if (bytes == 0) return 'n/a';
			    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			    if (i == 0) return bytes + ' ' + sizes[i];
			    return (bytes / Math.pow(1024, i)).toFixed(1) + '' + sizes[i];
			};
			
			/*
			 * 채팅방에서 파일 전송
			 */
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
		    
		    /*
		     * 내 정보 수정(왼쪽 상단으로 진입)
		     */
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
		    
		    /*
		     * 친구검색 (아마 다른데로 옮기거나 삭제될각?)
		     */
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
		    
		    /*
		     * 왼쪽 그룹 탭들
		     */
		    $('#myTab a:last').tab('show');
		    
		    /*
		     * 우측 상단에 파일 검색이나 메시지 로그 검색
		     */
		    $('.topSection').on('click', '#searchSec', function(e){
		    	e.preventDefault();
		    	$('#rightSection').css('width' ,  185 );
		    	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-20 );
		    	$('#rightSection').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-20);
		    	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-20 );
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
		    
		    /*
		     * 우측섹션 열린거 닫는거
		     */
		    $('#rightSection').on('click','#rigthClose', function(){
		    	$('#rightSection').empty();
		    	$('#rightSection').css('width' , 0);
		    	$('#rightSection').css('height', 0);
		    	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-20 );
		    	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() );
		    });
		    
		    /*
		     * 우측 섹션에 아카이브 공간 보여줌.
		     */
		    $('.topSection').on('click', '#archive', function(e){
		    	$('#rightSection').css('width' ,  185 );
		    	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-30 );
		    	$('#rightSection').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-20);
		    	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);
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
		    /*
		     * 사람초대, 친구목록 가져옴. 이 채팅방 이외의 사람들을 보여줘야지
		     * 
		     * */
			$('.topSection').on('click', "#invite", function(e){
				var room = $('#joinRoom').val();
		        $.ajax({
		            type: "post",
		            url: "/inviteRoom",
		            data : { "room" : room },
		            success: function(result,status,xhr){
		            	$('#inviteModal').modal();
		            	$("#inviteBody").html(result);
		            	
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
			});
			
			$('.topSection').on('click', '#inviteUser', function(){
				var arrayParam = new Array();
				var room = $('#joinRoom').val();
				$("input:checkbox[id=inUser]:checked").each(function(){
					arrayParam.push($(this).val());
				});
				socket.emit('inviteRoom', room, arrayParam);
				
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
		    
			/*
			 * 우측검색에서 아카이브에서 검색하는지, 메시지로그에서 검색하는지 구분하여 검색
			 * 
			 */
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
		    
		    /*
		     * 메시지 엔터
		     */
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
			
			/*
			 * 파일 검색하는데 있어서 받은건지 보낸건지 구분해줘서 검색
			 */
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
		    
			/*
			 * 모든 친구검색. 아마 고쳐지거나 사라질려나?
			 */
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
		    
		    /*
		     * 좌측에서 친구 리스트 가져옴
		     */
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
		    
		    /*
		     *  검색해서 친구추가(add) 누르면 친구 추가된걸 반환해서 다시 뿌려줌
		     */
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
		    
		    /*
		     * 칭구삭제
		     */
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
		    
		    /*
		     * 왼쪽 상단. 뷰 변경.
		     * 노티나 로그아웃, 개인정보 수정 가능
		     */
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
			
			/*
			 * 왼쪽 친구리스트에서 그룹생성. 새로 추가되는 친구는 기본적으로 default로 잡힘
			 */
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
			
			/*
			 * 그룹 삭제. 삭제된 그룹에 있던 인원들은 모두 default 그룹으로 이동
			 */
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
			
			/*
			 * 엔터키 눌렀을때 전송
			 */
			$(".mid").on('keyup','#inputMe',function(key){
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
			
			/*
			 * 센드버튼 누를때 메시지 전송
			 */
			$(".mid").on('click', "#btnSend",function(){
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
			/*
			 * 왼쪽 친구리스트에서 친구를 더블클릭 했을시
			 * 채팅방 뷰가 생성되면서 채빙방 입장.
			 * 단, 메시지를 보내야 채팅방이 생성됌
			 */
			$( "#leftSection" ).on( "dblclick", ".has-sub", function( event ) {
			    event.preventDefault();
			    $('#room').val('');
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
		            	$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-30);
		            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);
		            	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);
					    $("#messages").empty();
					    socket.emit('join', room, me);		            	
		            },
		            error: function(xhr, status, er){}
		        });

			});
			/*
			 * 왼쪽에서 대화방 리스트 중에서 선택하여 더블클릭 했을 시
			 * 입장
			 */
			$('#leftSection').on('dblclick', ".myRoom", function(e){
				$("#messages").empty();
				$('#room').val('');
				var roomName = $(this).attr("id");
				var me = $("#userId").val();
		        $.ajax({
		            type: "post",
		            url: "/joinChat",
		            success: function(result,status,xhr){
		            	$(".background").html(result);
		            	$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-30);
		            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);
		            	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);
					    $("#messages").empty();
					    socket.emit('rejoin', roomName,me);	            	
		            },
		            error: function(xhr, status, er){}
		        });
			});			
			/*
			 * 그냥 채팅룸 뷰 닫는거
			 */
			$('.topSection').on('click', '#roomClose', function(e){
		    	$('.background, .userInfo').empty();
		    	$('#roomInfo').text('');
		    	$('#room').val('');
		    	var me = $('.myInfoView').attr("id");
		    	var room = $('#joinRoom').val();
		    	socket.emit('roomOut', room, me);
			});
			/*
			 * 
			 */
			$('.topSection').on('dblclick', '#room', function(){
				$('#room').attr("disabled",false);
			});
			/*
			 * 채팅방 이름 개인설정. 채팅방 이름 더블클릭하면 수정 가능
			 */
			$('.topSection').on("keyup", "#room",function(key){
				if($("#room").val()){
					if(key.keyCode==13){
						var id = $('.myInfoView').attr("id");
						var room = $('#thisRoom').val();
						var val = $("#room").val();
						socket.emit('changeRoomName', id, room, val);
						$('#room').attr("disabled",true);
					}
				}
			});	
			/*
			 * 그냥 챗 버튼 누르면 대화 돌입. 더블클릭과 같음
			 */
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
			/*
			 * 왼쪽 방 정보 가져오기.
			 */
		    $('#leftSection').on("click","#getRoomList",function(){
		    	socket.emit('rooms', $('.myInfoView').attr("id"));
//				setInterval(function() {
//					socket.emit('rooms', $('.myInfoView').attr("id"));
//			    }, 10000);
		    });
			/*
			 * 그룹생성할때 모달로 띄움
			 */
			$('#leftSection').on('click', "#setGroup", function(e){
				$('#nameModal').modal();
			});
			
			
			/* 그룹 리스트에서 setting을 누르면 뜨는거
			 * 현재 그룹에 속해있는 유저들을 보여줌
			 * */
			
			$('#leftSection').on('click', ".GroupSetting", function(e){
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
			
			/*	+눌렀을때 뜨는 뷰
			 *  default에 속해있는 유저들을 보여줌
			 * */
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
			/*
			 * 그룹에 유저 추가. 리스트를 불러와 체크 한 후 확인누르면 추가됌.
			 */
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
			/*
			 * 그룹에서 짤짤
			 */
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
			/*
			 * 왼쪽 상단을 클릭한 후 뷰가 변경됬을시, 다시 왼쪽 상단을 누르면 기본 화면으로 돌아옴
			 */
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
			/*
			 * 왼쪽 상단으로 진입한 후 개인정보 수정.
			 */
			$('#leftSection').on('click', '#myInfoEdit',function(e){
				if($('#myCompany').is('[disabled=disabled]')){
					if(confirm("수정하시겠습니까?") == true){
						$('#myCompany, #position, #phoneNumber').attr("disabled",false);
						$(this).hide();
						$('#myInfoConfirm').show();
					}
				}				
			});
			/*
			 * 탈퇴엑
			 */
			$('#leftSection').on('click', '#signOutBtn',function(){
				$('div.modal').modal();
			});
			/*
			 * 친구 이름 누르면 정보를 모달로 띄움 ^^
			 */
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
			});
			

			
		});