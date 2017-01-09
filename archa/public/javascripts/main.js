
$(document).ready(function() {
			
			$('#leftSection').css('height' ,  $(window).height() );
			$('#friendlist').css('height' ,  $(window).height() - 465);
			$('.searchResult,#room-list').css('height' ,  $(window).height()-$('#setGroup').height()-$('.menuTop').height()-$('.memberSection').height()-$('.myInfo').height()-$('.nav').height() -67 );
		/*	$('.topMenu').css('width', $(window).width()-$('#leftSection').width());*/
			$(window).resize(function() {
				$('#leftSection').css('height' ,  $(window).height());
				$('#friendlist').css('height' ,  $(window).height() - 465);
				/*$('.topMenu').css('width', $(window).width()-$('#leftSection').width());*/
            	$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height());
            	/*$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -10);
            	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-10);*/
				$('.searchResult,#room-list').css('height' ,  $(window).height()-$('#setGroup').height()-$('.menuTop').height()-$('.memberSection').height()-$('.myInfo').height()-$('.nav').height() -67);
            	$('.archiveback').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()); 
            	$('.archiveback').css('height', $(window).height() - $('.topMenu').height()-$('.mySection').height());
            	$('#dataList').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()); 
            	/*$('.mySection').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
				if($('#rightSection').width()>10){
					$('#rightSection').css('width' ,  185 );
	            	$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height());
/*	            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-10);
	            	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-10 );*/
					$('#rightSection').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-20);
					$('#rightContent').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-$('#myTab').height()-30);
	            	$('.archiveback').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());
	            	$('.archiveback').css('height', $(window).height() - $('.topMenu').height()-$('.mySection').height());
	            	$('#dataList').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()); 
	            	/*$('.mySection').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
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
		    	/*$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-20 );*/
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
/*		    $('.topSection').on('click', '#archive', function(e){
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
		    });*/
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
		    $('#leftSection').on("click","#getcontacts",function(e) {
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
				
				$('.group-img').css('border','none')
				
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
		            	/*$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-30);*/
		            	$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height());
		            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());
		            	/*	$('.mid').css('margin-left' , -15);*/
		            	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());
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
		            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -10);
		            	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -10);
					    $("#messages").empty();
					    socket.emit('rejoin', roomName,me);	            	
		            },
		            error: function(xhr, status, er){}
		        });
			});			
			/*
			 * 그냥 채팅룸 뷰 닫는거$( "#leftSection" ).on( "dblclick", ".has-sub", function( event ) {
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
		    $('#leftSection').on("click","#getmessages",function(){
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
			/**
			 * message search 테스트용
			 */
			
	        lstEl = null;
	        cntr = -1;
	        $(".mid").on('click', '#btnSearch', function() {    	
		        var vl = $('#searchTerm').val();
		        $("#messages").removeHighlight();
		        $("#messages").highlight(vl);
		    });
		 
		    $('#btnNext').on('click', function() {
		        if (lstEl === null) {
		        	alert(lstEl);
		            lstEl = $('#messages').find('span.highlight');
		            if (!lstEl || lstEl.length === 0) {
		                lstEl = null;
		                return;
		            }
		        }
		        if (cntr < lstEl.length - 1) {
		            cntr++;
		            if (cntr > 0) {
		                $(lstEl[0]).removeClass('current');
		            }
		            var elm = lstEl[cntr];
		            $(elm).addClass('current');
		        } else
		            alert("End of search reached!");
		    });
		 
		    $('#btnPrev').on('click',function() {
		        if (lstEl === null) {
		            lstEl = $('#messages').find('span.highlight');
		            if (!lstEl || lstEl.length === 0) {
		                lstEl = null;
		                return;
		            }
		        }
		        if (cntr > 0) {
		            cntr--;
		            if (cntr < lstEl.length) {
		                $(lstEl[cntr + 1]).removeClass('current');
		            }
		            var elm = lstEl[cntr];
		            $(elm).addClass('current');
		        } else
		            alert("Begining of search!");
		    });
		    /**
		     * 여기까지 테스트용
		     */
		    
		    /**
		     * 새로운 아카이브 화면
		     */
			$( ".topMenu" ).on( "click", "#archive", function( event ) {
			    event.preventDefault();
			    
		        $.ajax({
		            type: "post",
		            url: "/myArchive",
		            success: function(result,status,xhr){
		            	$(".background").html(result);
		            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());
		            	$('.archiveback').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());
		            	$('.archiveback').css('height', $(window).height() - $('.topMenu').height()-$('.mySection').height());
		            	/*$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height());*/
		            },
		            error: function(xhr, status, er){}
		        });

			});
			
			/*
			 * 아카이브 탭 got / sent 클릭시 카테고리 구분하여 불러옴......
			 */
			$(".mid").on("click", ".march", function(event){
				event.preventDefault();
				var url = $(this).attr("id");
				var category = $(".archiveName").text();
				var div;
				
				if(url=='tabgot'){
                    div = $('#got');
                    $('#got').show();
                    $('#sent').hide();
                }else{
                    div = $('#sent');
                    $('#sent').show();
                    $('#got').hide();
                }
		        $.ajax({
		            type: "post",
		            url: "/"+url,
		            data : { "category" : category },
		            success: function(result,status,xhr){
		            	div.html(result);
		            },
		            error: function(xhr, status, er){}
		        });				
			});
			/*
			 * 아카이브 탭 got / sent 클릭시 css......
			 */
			$(".mid").on("click", "#tabgot", function(event){
	
				$("#tabsent").css({backgroundColor: '#CFD8DC'});
				$("#tabgot").css({backgroundColor: 'white'});
				$("#tabgot").css({color:  '#4A7DFF'});
				$("#tabsent").css({color: '#78909C'});
			});
			
			$(".mid").on("click", "#tabsent", function(event){

				$("#tabgot").css({backgroundColor: '#CFD8DC'});
				$("#tabsent").css({backgroundColor: 'white'});
				$("#tabsent").css({color: '#4A7DFF'});
				$("#tabgot").css({color: '#78909C'});
			});
			
			
			/*
			 * 아카이브 카테고리 변경시 변경
			 */
			$(".mid").on("click", ".category", function(event){
				event.preventDefault();
				var url = $(this).attr("id");
				$(".archiveName").text(url);
				
		        $.ajax({
		            type: "post",
		            url: "/"+url,
		            success: function(result,status,xhr){
		            	$("#dataList").html(result);
		            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());
		            	$('.archiveback').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());
		            	$('.archiveback').css('height', $(window).height() - $('.topMenu').height()-$('.mySection').height());
		            	
		            }
		        });
			});
			
			/*
			 * 알람 뷰
			 */
			$( ".topMenu" ).on( "click", "#dropAlarm", function( event ) {
			    event.preventDefault();
			    
		        $.ajax({
		            type: "post",
		            url: "/alarm",
		            success: function(result,status,xhr){
		            	$(".alarm-drop").html(result);
		            },
		            error: function(xhr, status, er){}
		        });

			});
			/*
			 * 친구찾긔 뷰
			 */
			$(".topMenu").on("click", "#findRelation", function(event){
				event.preventDefault();
		        $.ajax({
		            type: "post",
		            url: "/findRelation",
		            success: function(result,status,xhr){
		            	$(".background").html(result);
		            	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);
		            },
		            error: function(xhr, status, er){}
		        });				
			});
			/*
			 * 알람 req / noti 클릭
			 */
			$(".mid").on("click", ".altab", function(event){
				event.preventDefault();
				var url = $(this).attr("id");
				var div;
				
				if(url=='tabReq'){
					div = $('#request');
				}else{
					div = $('#notification');
				}
					
		        $.ajax({
		            type: "post",
		            url: "/"+url,
		            data : { "category" : category },
		            success: function(result,status,xhr){
		            	div.html(result);
		            },
		            error: function(xhr, status, er){}
		        });				
			});
			/*
			 * 아카이브 검색
			 */
			$('.mid').on("keyup", ".archiveInputSearch",function(key){
					if(key.keyCode==13){
						var category = $(".archiveName").text();
				    	var search = $(".archiveInputSearch").val();
				    	var url = $("ul#tabgs li.active").attr('id');
				    	var div;
				    	
				    	if(url=='tabgot'){
				    		div = $('#got');
				    	}else{
				    		div = $('#sent');
				    	}
				 
				        $.ajax({
				            type: "post",
				            url: "/"+url,
				            data: { "search": search, "category": category },
				            success: function(result,status,xhr){
				            	div.html(result);
				            }
				        });
					}
			});
			/*
			 * relation 검색, 유저리스트
			 */
		    $('.mid').on("click","#searchRelation",function(e) {
		    	var search = $("#relationInput").val();
		        $.ajax({
		            type: "post",
		            url: "/findRelationUser",
		            data: { "search": search },
		            success: function(result,status,xhr){
		            	$("#relationResult").html(result);
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
		    });
		    /*
		     * 생각해보니 소켓으로 안해도 된다. 소켓서버에 부담을 줄이자. 이건 걍 ajax로 바꾸자??
		     * 리턴이 문제네
		     */
		    $('.mid').on("click", ".addRelation", function(e){
		    	var id = $(this).attr("id");
		    	$('.background').empty();
		    	socket.emit('newRelation', id);
		    });
		    /*
		     * 알람->리퀘스트에서 Connect를 누르면 서로 친구추가해주긔
		     */
		    $('.topMenu').on("click", ".conn", function(e){
		    	e.preventDefault();
		    	var id = $(this).attr("id");
		    	var me = $('.myInfoView').attr("id");
		    	socket.emit('requestConn',id,me);
		    });
			/*
			 * 드롭다운 클릭해도 사라지지않게
			 */
			$(document).on('click', '#tabalarm li', function (e) {
				  e.stopPropagation();
			});
			
			
			/*  채팅방목록 모달 2016_11_25 NA*/

				$('.mid').on('click', '#chativ', function(e){
						alert('invite click'); 
						e.preventDefault();
						var femail = $(this).attr("class");
						alert($(this).attr("class"));
				        $.ajax({
				            type: "post", 
				            url: "/chatlist",
				            data : { "friend" : femail },
				            success: function(result,status,xhr){
				            	alert("ajax success");
				            	$("#myModal").html(result);
				            	$("#myModal").modal();
				            },
				            error: function(xhr, status, er){}
				        });
					});
				/* archive mouseover 2016-01-06 */
				
				$(".mid").on("mouseenter",".filebox", function(event){
	
					var icon= '<div id="archive-icon">\
							   <div id="archive-delete"></div>\
			  				   <div id="archive-link"></div>\
			  				   <div id="archive-download"></div></div>';

					$(this).append(icon);
					
			});
				$(".mid").on("mouseleave",".filebox", function(event){
					
					$(this).find("#archive-delete").remove();
					$(this).find("#archive-link").remove();
					$(this).find("#archive-download").remove();

			});
				
				/* gallery mouseover 2016-01-06 */
				
				$(".mid").on("mouseenter",".gallery", function(event){
	
					var icon= '<div id="gallery-icon">\
							   <div id="gallery-delete"></div>\
			  				   <div id="gallery-link"></div>\
			  				   <div id="gallery-download"></div></div>';

					$(this).append(icon);
					
			});
				$(".mid").on("mouseleave",".gallery", function(event){
					
					$(this).find("#gallery-delete").remove();
					$(this).find("#gallery-link").remove();
					$(this).find("#gallery-download").remove();

			});

				

});
