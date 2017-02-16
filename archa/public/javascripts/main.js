
$(document).ready(function() {
			$('#leftbar').css('height' ,  $(window).height() );
			$('#leftSection').css('height' ,  $(window).height() );
			$('#friendlist').css('height' ,  $(window).height()-$('#topcontacts').height()-$('.myInfo').height()-$('#inputSearchMember').height()-10);
			$('.searchResult,#room-list').css('height' ,  $(window).height()-$('#setGroup').height()-$('.menuTop').height()-$('.memberSection').height()-$('.myInfo').height()-$('.nav').height() -67 );
			$('.dtprofile').css('height' ,  $(window).height() );
        	$('#relationResult').css('height', $(window).height() );
        	$('#top-side').css('height', $(window).height() );
			$(window).resize(function() {
				$('#leftbar').css('height' ,  $(window).height() );
				$('#leftSection').css('height' ,  $(window).height());
				$('#friendlist').css('height' ,  $(window).height()-$('#topcontacts').height()-$('.myInfo').height()-$('#inputSearchMember').height()-10);
				/*$('.topMenu').css('width', $(window).width()-$('#leftSection').width());*/
				$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height()-30);
            	/*$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -10);
            	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-10);*/
				$('.searchResult,#room-list').css('height' ,  $(window).height()-$('#setGroup').height()-$('.menuTop').height()-$('.memberSection').height()-$('.myInfo').height()-$('.nav').height() -67);
            	/*$('.archiveback').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()); */
            	$('.archiveback').css('height', $(window).height() - $('.topMenu').height()-$('.mySection').height());
            	$('#dataList').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()); 
            	$('#relationResult').css('height', $(window).height() );
            	$('#top-side').css('height', $(window).height() );
                    $('.setInfo').css('width' ,  $(window).width());
                    $('.setInfo').css('height' ,  $(window).height());
                    $('.dtprofile-background').css('width' ,  $('.setInfo').width()+30);
                    $('.dtprofile-background').css('height' ,  $('.setInfo').height()+30);
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
			 * 테스트를 위한 임시주석
			 */ 
/*		    $('.mid').on("click","#fileSend", function(event) {
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
		    });*/
		    /*
		     * 서브밋 테스트
		     * 
		     */
/*		    $('.mid').on("submit","#fileInfo", function(event) {
		    	event.preventDefault();
		    	alert('서부밋')
		        var data = new FormData();
		        data.append('roomName', $('#thisRoom').val());
		        data.append('you', $('#you').val());
		        var filesList = document.getElementById('file');
		        
		        for (var i = 0; i < filesList.files.length; i ++) {
		            data.append('userfile', filesList.files[i]);
		        }
		        
		        return true;
		        
		    });*/
		    $('.mid').on("click", ".plusbtn", function(e){
		    	if (this === e.target) {
		    		$('#file').trigger("click");
		    	}
		    });
		    /*
		     *  프로그레스바 테스트
		     *  어찌어찌 완료
		     */

			$('.mid').on("change","#file",function(e){
				//disable the actual submit of the form.
				e.preventDefault(); 
				//grab all form data 
				socket.emit('roomUser',$('#thisRoom').val());
				socket.on('roomUser', function(user){
					var form = $('form')[0];
					var formData = new FormData(form);

					var upfiles_cnt = document.getElementById('file').files.length
					if(upfiles_cnt == 0){
						alert('선택한 파일이 없습니다');
						return false; // form을 전송시키지 않고 반환
					}
					alert(user);
					formData.append('userList', user);
			        formData.append('roomName', $('#thisRoom').val());
			        formData.append('you', $('#you').val());
			        console.log(formData);
			        var filesList = document.getElementById('file');
			        
			        for (var i = 0; i < filesList.files.length; i ++) {
			        	formData.append('userfile', filesList.files[i]);
			        }
			        
					$.ajax({
						// set data type json 
						dataType:  'json',
						data		:	formData,
						processData	:	false,
						contentType	:	false,
						type		:	'POST',
						url			:	"/fileSend",
						// reset before submitting 
						beforeSend: function() {
							$('.progress').show();
							$('.bar').show();
							$('.percent').show();
							$('.bar').css('width','0%');
							$('.percent').text('0%');
						},

						// progress bar call back
						uploadProgress: function(event, position, total, percentComplete) {
							var pVel = percentComplete + '%';
							$('.bar').css('width',pVel);
							if(percentComplete != 100){
								$('.percent').text(pVel);
							}else{
								$('.percent').text(pVel+" 파일을 서버에 업로드중입니다.");
							}
							
						},
			            success	: function(data,status,xhr){
			            	$('.progress,.bar,.percent').hide();
							$('.percent').text('0%');
							socket.emit('dataInfoSend', data,$('#leftSection').attr('class'),$("#userId").val());
			            },
			            error: function(xhr, status, er){
			            	console.log("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+er);
			            }
					});
					return false;					
				});

			});
		    
		    /*
		     * 내 정보 수정(왼쪽 상단으로 진입)
		     */
/*		    $('#leftSection').on('click','#myInfoConfirm', function(e){
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
		    });*/
		    
		    /*
		     * 친구검색 (아마 다른데로 옮기거나 삭제될각?)
		     */
		    $('.leftchat').on('keyup','#inputSearchMember', function(key) {
		    	if(key.keyCode == 13){
			    	var search = $("#inputSearchMember").val();
			        $.ajax({	
			            type: "post",
			            url: "/searchFriend",
			            data: { "inputSearchMember": search },
			            success: function(result,status,xhr){
			            	$(".searchResult").html(result);
			            	$('#friendlist').css('height' ,  $(window).height()-$('#topcontacts').height()-$('.myInfo').height()-$('#inputSearchMember').height()-10);
			            },
			            error: function(xhr, status, er){
			            	console.log("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+er);
			            }
			        });
		    	}
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
		    	/*$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() );*/
		    });
		    

/*		    
		     * 사람초대, 친구목록 가져옴. 이 채팅방 이외의 사람들을 보여줘야지
		     * 
		     * 
			$('.mid').on('click', "#invite", function(e){
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
			});*/
			
			/*	채팅방목록 모달 2016_11_25 NA
			 * 	수정 17_01_18
			 * 
			 */

			$('.mid').on('click', '.invite-room', function(e){
					e.preventDefault();
					var room = $('#joinRoom').val();
					var me = $('#leftSection').attr('class');

			        $.ajax({
			            type: "post", 
			            url: "/inviteRoom",
			            data : { "room" : room },
			            success: function(result,status,xhr){
			            	$('#inviteModal').modal();
			            	$("#inviteModal").html(result);
			            },
			            error: function(xhr, status, er){}
			        });
			});
			
			$('.mid').on('click', '#leaveRoom', function(e){
				e.preventDefault();
/*				var room = $('#joinRoom').val();
		        $.ajax({
		            type: "post", 
		            url: "/inviteRoom",
		            data : { "room" : room },
		            success: function(result,status,xhr){
		            	$('#inviteModal').modal();
		            	$("#inviteModal").html(result);
		            },
		            error: function(xhr, status, er){}
		        });*/
				$("#mySidenav").css('width',0);
				$(".friendInfo").remove();
				var room = $('#joinRoom').val();
				var me = $('#leftSection').attr('class');
				socket.emit('roomOut', room,me);
				$('.background').empty();
				if($('.myRoom').length > 0){
					$('[id="'+room+'"]').remove();
				}
			});
			/*
			 * 체크박스 선택시 액션
			 */
			$('.mid').on('change', '.roomInvite',function(){
				var pa = $(this).parent('.has-sub');
				var id = pa.attr('id');
				var temp = $('<div/>').attr('id', id).addClass('selectResult');
/*				var img = $(this).parent('.has-sub').children('#invite-profile').clone();*/
				var img = $(this).parent('.has-sub').children('#invite-profile').children('#invite-img').clone();
				img.css('float','left');
				var name = $(this).parent('.has-sub').children('#invite-profile').children('#invite-fname').attr('class');
				var nameDiv = $('<div/>').addClass('selectName').text(name);
				nameDiv.css('float','left');
				temp.append(img);
				temp.append(nameDiv);
				if($(this).is(":checked")){
					if($('.select-list').children('[id="'+id+'"]').length>0){
						
					}else{
						temp.clone().appendTo('.select-list');
					}
				}else{
					$('.select-list').children('[id="'+id+'"]').remove();
				}
				
			});
			
			/*
			 * 채팅방 초대 모달에서 확인 누르면 친구 바로 초대
			 */
			$('.mid').on('click', '#inviteUser', function(){

				var arrayParam = new Array();
				var room = $('#joinRoom').val();
				$("input:checkbox[class=roomInvite]:checked").each(function(){
					arrayParam.push($(this).val());
				});
				socket.emit('inviteRoom', room, arrayParam);
				$("#mySidenav").css('width',0);
				$('.friendInfo').remove();
			});
			/*
			 * room invite modal에서 유저검색.
			 */
			var isc;
			$('.mid').on('keyup', '#inviteSearch' , function(key){
/*				if(key.keyCode == 13){
					var search = $('#inviteSearch').val();
					if(search){
						isc = $('.member-select').children('.panel-body').clone();
						var room = $('#joinRoom').val();
				        $.ajax({
				            type: "post",
				            url: "/inviteUserSearch",
				            data: { "search": search, "room":room },
				            success: function(result,status,xhr){
				            	$('.member-select').children('.panel-body').html(result);
				            },
				            error: function(xhr, status, er){}
				        });						
					}else{
						$('.member-select').append(isc);
					}

				}*/
				if(key.keyCode == 13){
					var search = $('#inviteSearch').val();
					var room = $('#joinRoom').val();
			        $.ajax({
			            type: "post",
			            url: "/inviteUserSearch",
			            data: { "search": search, "room":room },
			            success: function(result,status,xhr){
			            	$('.member-select').children('.panel-body').html(result);
			            },
			            error: function(xhr, status, er){}
			        });						

				}
			});
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
					var id = $('#you').val();
					var message = {
							type	: 'text',
							email : $('#leftSection').attr('class'),
					        me  : $("#userId").val(),
					        msg: $("#inputMe").val(),
					        yourName : $(this).attr("name")
					};
				    socket.emit('message', message);
				    $("#inputMe").val("");
				  }
				}
			});
			
			/*
			 * 왼쪽 친구리스트에서 친구를 더블클릭 했을시
			 * 채팅방 뷰가 생성되면서 채빙방 입장.
			 * 단, 메시지를 보내야 채팅방이 생성됌
			 */
			$( "#leftSection" ).on( "dblclick", ".has-sub", function( event ) {
				console.log(event)
				$('.group-img').css('border','none');

			    event.preventDefault();
			    $('#room').val('');
			    var you = $(this).attr("id");
			    var me = $('#leftSection').attr('class');
			    var youName = $(this).children("#group-profile").children("#fname").attr("class");
			    var room = {
			    		you : you,
			    		me : me
			    }
			    
		        $.ajax({
		            type: "post",
		            url: "/joinChat",
		            data:{ "yourName": youName },
		            success: function(result,status,xhr){
		            	$(".background").html(result);
		            	/*$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height());*/
		            	$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height()-30);
		            	/*$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
		            	/*	$('.mid').css('margin-left' , -15);*/
		            	/*$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
					    $("#messages").empty();
					    socket.emit('join', room, me, youName);		     	
		            },
		            error: function(xhr, status, er){}
		        });

			});
			/*
			 * 왼쪽에서 대화방 리스트 중에서 선택하여 더블클릭 했을 시
			 * 입장
			 */
			$('#leftSection').on('click', ".myRoom", function(e){
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
		            	/*$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -10);*/
		            	/*$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -10);*/
					    $("#messages").empty();
					    socket.emit('rejoin', roomName,me);
		            },
		            error: function(xhr, status, er){}
		        });
			});			

			$('.mid').on('dblclick', '.room-name-change', function(){
				$('.room-name-change').attr("disabled",false);
			});
			/*
			 * 채팅방 이름 개인설정. 채팅방 이름 더블클릭하면 수정 가능
			 */
			$('.mid').on("keyup", ".room-name-change",function(key){
				if($("#room").val()){
					if(key.keyCode==13){
						var id = $('#leftSection').attr('class');
						var room = $('#thisRoom').val();
						var val = $(".room-name-change").val();
						$('#room').val(val);
						socket.emit('changeRoomName', id, room, val);
						$('.room-name-change').attr("disabled",true);
					}
				}
			});	
			/*
			 * 그냥 챗 버튼 누르면 대화 돌입. 더블클릭과 같음
			 */
			$( "#leftSection" ).on( "click", ".chatbtn", function( event ) {
			    event.preventDefault();
			    var you = $(this).attr("id");
			    var me = $('#leftSection').attr('class');
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
		    	socket.emit('rooms', $('#leftSection').attr('class'));
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
/*			$('#leftSection').on('click', '#fname', function(e){
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
			});*/
		    
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
		            	/*$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
		            	/*$('.archiveback').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
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
                    $('#tabgot').addClass('active');
                    $('#tabsent').removeClass('active');
                    $('#got').show();
                    $('#sent').hide();
                }else{
                    div = $('#sent');
                    $('#tabsent').addClass('active');
                    $('#tabgot').removeClass('active');
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
		            error: function(xhr, status, er){
		            	/*console.log("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+er);*/
		            }
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
/*			$(".mid").on("click", ".category", function(event){
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
			});*/
			
			/*
			 * 아카이브 카테고리 변경시 변경
			 */
			$("#leftSection").on("click", ".category", function(event){

				event.preventDefault();
				var url = $(this).attr("id");
				$(".archiveName").text(url);
				
		        $.ajax({
		            type: "post",
		            url: "/"+url,
		            success: function(result,status,xhr){
		            	$("#dataList").html(result);
		            /*	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
		            /*	$('.archiveback').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
		            	$('.archiveback').css('height', $(window).height() - $('.topMenu').height()-$('.mySection').height());
		            	
		            }
		        });
			});
			
			/*
			 * 알람 뷰
			 */
			$( "#leftbar" ).on( "click", "#dropAlarm", function( event ) {
			    event.preventDefault();
			    $(".leftconnection").empty();
		    	$(".leftarch, .setInfo, .leftchat").hide();
		    	$(".leftconnection, .container-fluid").show();
		        $.ajax({
		            type: "post",
		            url: "/tabReq",
		            success: function(result,status,xhr){
		            	$(".background").html(result);
		            	$('#relationResult').css('height', $(window).height() );
		            	$('#top-side').css('height', $(window).height() );
		            },
		            error: function(xhr, status, er){}
		        });
		        var text= '<div id="topconnect">ADD NEW CONTACTS</div>\
		        		   <div class="searchbox">\
		        	       <div class="contact-text"><div id="email-icon"></div>E-mail</div>\
		        		   <div class="contact-input">\
		    				<input type="text" class="form-control" id="relationInput"></div>\
		    				<button class="search-message" id="searchRelation">Search</button></div>\
		        	       </div>\
		        		   </div>\
		        		   <div class="searchbox">\
			        	       <div class="contact-text"><div id="phone-icon" class="icon-phone"></div>Phone</div>\
			        		   <div class="contact-input">\
								  <select class="form-control" id="phone-select">\
								  <option>+82</option>\
								  <option>+01</option>\
								  <option>+81</option>\
								  <option>+86</option>\
								  <option>+61</option>\
								  <option>+44</option>\
								  <option>+63</option>\
								  <option>+852</option>\
								  <option>+66</option>\
								  </select>\
								  <input type="text" class="form-control" id="phone-input">\
    							  <button class="search-message" id="#">Search</button></div>\
			        	       </div>\
		        		   </div>\
		        		   <div class="notibox">\
		        	<div id="topconnect">Notifications</div><div id="noti-text"></div>\
		        	</div>\
		        	\
		        	';
		        $('.leftconnection').append(text);
		        socket.emit('noti', $('#leftSection').attr('class'));
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
		            	/*$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);*/
		            },
		            error: function(xhr, status, er){}
		        });				
			});
			/*
			 * 알람 req / noti 클릭
			 */
			$(".topMenu").on("click", ".altab", function(event){
				event.preventDefault();
				var url = $(this).attr("id");
				var div;

				if(url=='tabReq'){
					div = $('#request');
					$('#request').show();
					$('#notification').hide();
				}else{
					div = $('#notification');
					$('#notification').show();
					$('#request').hide();
				}
					
		        $.ajax({
		            type: "post",
		            url: "/"+url,
		            success: function(result,status,xhr){
		            	div.html(result);
		            },
		            error: function(xhr, status, er){}
		        });				
			});
			
			/*
			 * 드롭다운 클릭해도 사라지지않게
			 */
			$(document).on('click', '#tabalarm li', function (e) {
				  e.stopPropagation();
			});
			/*
			 * 아카이브 검색
			 */
			$('.mid').on("keyup", ".archiveInputSearch",function(key){
				if(key.keyCode==13){
					var category = $(".archiveName").text();
			    	var search = $(".archiveInputSearch").val();
			    	var url = $("div.archiveback div.active").attr('id');
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
		    $('.leftconnection').on("click","#searchRelation",function(e) {
		    	/*$('.background').empty();*/
		    	var search = $("#relationInput").val();
		        $.ajax({
		            type: "post",
		            url: "/findRelationUser",
		            data: { "search": search },
		            success: function(result,status,xhr){
		            	$(".background").html(result);
		            	$('#relationResult').css('height', $(window).height() );
		            	$('#top-side').css('height', $(window).height() );
		            },
		            error: function(xhr, status, er){
		            	/*console.log("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+er);*/
		            }
		        });
		        e.preventDefault();
		    });
		    
			/*
			 * relation 검색, 유저리스트
			 */
/*		    $('.mid').on("click","#searchRelation",function(e) {
		    	var search = $("#relationInput").val();
		        $.ajax({
		            type: "post",
		            url: "/findRelationUser",
		            data: { "search": search },
		            success: function(result,status,xhr){
		            	$("#relationResult").html(result);
		            },
		            error: function(xhr, status, er){
		            	console.log("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+er);
		            }
		        });
		        e.preventDefault();
		    });*/
		    
		    /*
		     * 생각해보니 소켓으로 안해도 된다. 소켓서버에 부담을 줄이자. 이건 걍 ajax로 바꾸자??
		     * 리턴이 문제네
		     */
		    $('.mid').on("click", ".addRelation", function(e){
		    	
		    	$(this).parent('#connect-profile').remove();
		    	var id = $(this).attr("id");
//		    	var name = $(this).parent('#group-profile').children("#fname").attr('class');
//		    	var company = $(this).parent('#group-profile').children("#fname").children("#company").attr("class");
//		    	var position = $(this).parent('#group-profile').children("#fname").children("#position").attr("class");
		    	var name = $(".myInfoView").children("#name").val();
		    	var company = $(".myInfoView").children("#company").val();
		    	var position = $(".myInfoView").children("#position").val();
		    	socket.emit('newRelation', id, name, company, position);
		    });
		    /*
		     * 알람->리퀘스트에서 Connect를 누르면 서로 친구추가해주긔
		     */
		    $('.background').on("click", ".conn", function(e){
		    	
            	$(this).parent('#connect-profile').remove();
		    	e.preventDefault();
		    	var friend = $(this).attr("id");
		        $.ajax({
		            type: "post",
		            url: "/connFriend",
		            data: { 'friendId':friend },
		            success: function(result,status,xhr){
		            	$(".searchResult").html(result);

		            	
//		            	socket.emit('connHistory',id,me);
		            },
		            error: function(xhr, status, er){}
		        });
		    	
		    });
		    /*
		     * 알람에서 dec클릭하면 지움
		     */
		    
		    $('.background').on("click", ".dec", function(e){
		    	e.stopPropagation();
		    	$(this).parent().remove();
		    	socket.emit('decline', $(this).attr("id"));
		    });		    
			/* archive mouseover 2016-01-06 */
				
			$(".mid").on("mouseenter",".filebox", function(event){
				var icon= '<div id="archive-icon">\
						   <div id="archive-delete" class="'+$(this).attr('id')+'"></div>\
		  				   <div id="archive-link" class="'+$(this).attr('id')+'"></div>\
		  				   <div id="archive-download"  class="'+$(this).attr('id')+'"></div></div>';

				$(this).append(icon);
			});
			$(".mid").on("mouseleave",".filebox", function(event){
				$(this).find("#archive-icon").remove();
/*				$(this).find("#archive-link").remove();
				$(this).find("#archive-download").remove();*/

			});			
			/* gallery mouseover 2016-01-06 */
			
			$(".mid").on("mouseenter",".gallery", function(event){
				var icon= '<div id="gallery-icon">\
						   <div id="gallery-delete" class="'+$(this).attr('id')+'"></div>\
		  				   <div id="gallery-link" class="'+$(this).attr('id')+'"></div>\
		  				   <div id="gallery-download" class="'+$(this).attr('id')+'"></div></div>';

				$(this).append(icon);
			});
			$(".mid").on("mouseleave",".gallery", function(event){
				$(this).find("#gallery-icon").remove();
/*				$(this).find("#gallery-link").remove();
				$(this).find("#gallery-download").remove();*/
			});
			
			$(".mid").on('click', "#archive-download, #gallery-download", function(e){
				var url = $(this).attr('class');
				$(location).attr('href',url);
			});
			$(".mid").on('click', "#archive-link, #gallery-link", function(e){
			    var temp = $("<input>");
			    var text = $(this).attr('class');
			    $(this).append(temp);
			    temp.val(text).select();
			    document.execCommand("copy");
			    temp.remove();
			});
			$('.mid').on('click', '#archive-delete, #gallery-delete', function(){
				
				var url = $(this).attr('class');
				$('[id="'+url+'"]').remove();
				var temp = url.split('/');
			    $.ajax({
			        type: "post",
			        url: "/deleteFile",
			        data: { "url":url },
			        success: function(data,status,xhr){
			        	alert(data);
			        },
			        error: function(xhr, status, er){
			        	console.log("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+er);
			        }
			    });
			});

			/* right archive mouseover 2016-01-06 */
				
			$(".mid").on("mouseenter",".filebox-archive", function(event){
				var icon= '<div id="archive-icon" style="position: absolute;right: 0px;">\
		  				   <div id="rarchive-link" class="'+$(this).attr('id')+'"></div>\
		  				   <div id="rarchive-download" class="'+$(this).attr('id')+'"></div></div>';
				$(this).children('.archive-textbox').prepend(icon);
			});
			
			$(".mid").on("mouseleave",".filebox-archive", function(event){
				$(this).find("#archive-icon").remove();
			});
			
			/* right gallery mouseover 2016-01-06 */
				
			$(".mid").on("mouseenter",".gallery-filebox", function(event){
				var icon= '<div id="gallery-icon" style="position: absolute;right: 0px;">\
						   <div id="rgallery-link" class="'+$(this).attr('id')+'"></div>\
		  				   <div id="rgallery-download" class="'+$(this).attr('id')+'"></div></div>';

				$(this).children('.gallery-textbox').prepend(icon);
			});
			$(".mid").on("mouseleave",".gallery-filebox", function(event){
				$(this).find("#gallery-icon").remove();
/*				$(this).find("#rgallery-download").remove();*/
			});
			$(".mid").on('click', "#rarchive-download, #rgallery-download", function(e){
				var url = $(this).attr('class');
				$(location).attr('href',url);
			});
			$(".mid").on('click', "#rarchive-link, #rgallery-link", function(e){
			    var temp = $("<input>");
			    var text = $(this).attr('class');
			    $(this).append(temp);
			    temp.val(text).select();
			    document.execCommand("copy");
			    temp.remove();
			});			

			/*
			 * 친구 프로필 클릭하면 우측에 생성
			 */
			$('#leftSection').on('click', '#group-img', function(e){

				$("#mySidenav").css('width',350);
				$("#mySidenav").css('height', $(window).height()-$('#archive').height()-$('.searchDiv').height()-130);
				e.preventDefault();
				var room = $('#thisRoom').val();
				var id = $(this).attr("class");
			    $.ajax({
			        type: "post",
			        url: "/friendInfo",
			        data: { "room":room , "friend" : id },
			        success: function(result,status,xhr){
			        	$('#mySidenav').html(result);
			        },
			        error: function(xhr, status, er){}
			    });
			});
			/*
			 * 룸 타이틀 이미지 클릭하면 우측에 정보 생성
			 */
			$('.mid').on('click', '.myRoom-title-img', function(e){
				$("#mySidenav").css('width',350);
				$("#mySidenav").css('height', $(window).height()-$('#archive').height()-$('.searchDiv').height()-130);
				var room = $('#thisRoom').val();			
			    $.ajax({
			        type: "post",
			        url: "/roomInfo",
			        data: { "room":room },
			        success: function(result,status,xhr){
			        	socket.emit('roomInfoImage', room);
			        	$('#mySidenav').html(result);
			        	$('.room-name-change').val($('#room').val());
			        },
			        error: function(xhr, status, er){
			        	console.log("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+er);
			        }
			    });		
			});
			
			/*
			 * 룸아카이브 선택시 여러가지......시발
			 */
			$('.mid').on('click', '.roomRight', function(e){
			/*	$('#rightSection').css('width' ,  185 );
				$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-30 );
				$('#rightSection').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-20);
				$('.actionBox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);*/
				$("#mySidenav").css('width',350);
				
			/*	$(".topchat").css('margin-right',250);*/
				$("#mySidenav").css('height', $(window).height()-$('#archive').height()-$('.searchDiv').height()-130);
				e.preventDefault();
				var room = $('#thisRoom').val();
				var url = $(this).attr("id");
				
			    $.ajax({
			        type: "post",
			        url: "/"+url,
			        data: { "room":room },
			        success: function(result,status,xhr){
			        	$('#mySidenav').html(result);
			        	/*$('#rightContent').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-$('#myTab').height()-30);*/
			        },
			        error: function(xhr, status, er){}
			    });
			});		
			
		    /*
		     * 우측섹션 열린거 닫는거
		     */
		    $('.mid').on('click','.closebtn', function(){
				$("#mySidenav").css('width',0);
				$('.friendInfo').remove();
				/*$(".topchat").css('margin-right',0);*/
/*		    	$('#rightSection').empty();
		    	$('#rightSection').css('width' , 0);
		    	$('#rightSection').css('height', 0);
		    	$('.actionBox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);
		    	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-20 );
		    	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -30);*/
		    });
		    
		    /*
		     * 우측섹션 열린거 닫는거
		     */
		    $('.topchat').on('click','.closebtn', function(){
				$("#mySidenav").css('width',0);
				$('.friendInfo').remove();
				/*$(".topchat").css('margin-right',0);*/
/*		    	$('#rightSection').empty();
		    	$('#rightSection').css('width' , 0);
		    	$('#rightSection').css('height', 0);
		    	$('.actionBox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);
		    	$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-20 );
		    	$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -30);*/
		    });
		    
			
			/*
			 * 응~ 룸 아카이브 검색~
			 */
			var lstEl = null;
			var cntr = -1;
			$('.mid').on('keyup', '#searchRoomArchive', function(key){
				var sp = $(this).val().split(":");
				if(key.keyCode==13){
					if(sp[0] == 'File' || sp[0] == 'Image' || sp[0] == 'Link'){
						var url;
						var search;
						switch(sp[0]){
							case 'File'		: url = 'roomArchive'; search = sp[1]; break;
							case 'Image'	: url = 'roomGallery'; search = sp[1]; break;
							case 'Link'		: url = 'roomLinks';   search = sp[1]; break;
//								default	: url = $('.roomArchivetitle').attr("id"); search = $('#searchRoomArchive').val();
						}
						var room = $('#thisRoom').val();
//							var search = $('#searchRoomArchive').val();
						$("#mySidenav").css('width',350);
						$("#mySidenav").css('height', $(window).height()-$('#archive').height()-$('.searchDiv').height()-95);

					    $.ajax({
					        type: "post",
					        url: "/"+url,
					        data: { "room":room, "search":search },
					        success: function(result,status,xhr){
					        	$('#mySidenav').html(result);
/*								$('#rightSection').css('width' ,  185 );
								$('.msgbox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width()-30 );
								$('#rightSection').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-20);
								$('.actionBox').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width() -20);
					        	$('#rightSection').html(result);
					        	$('#rightContent').css('height',  $(window).height()-$('#archive').height()-$('.searchDiv').height()-$('#myTab').height()-30);*/
					        },
					        error: function(xhr, status, er){
					        	/*console.log("code:"+xhr.status+"\n"+"message:"+xhr.responseText+"\n"+"error:"+er);*/
					        }
					    });
					}else{
						$("#messageSearch,#closeSearchMsg").show();
						lstEl = null;
						cntr = -1;
						var vl = $(this).val();
						$(".talk").removeHighlight();
						$(".talk").highlight(vl);
						if (lstEl === null) {
							lstEl = $('.talk').find('span.highlight');
							$("#lengthSearch").val(lstEl.length);
							$("#countNum").val(lstEl.length==0? 0:1);
							if (!lstEl || lstEl.length === 0) {
								lstEl = null;
								return;
							}
						}
					}  
				}
			});
			$('.mid').on('click','#closeSearchMsg',function(){
				lstEl = null;
				cntr = -1;
				$(".talk").removeHighlight();
				$(this).hide();
				$('#messageSearch').hide();
			});
			$(".mid").on("click", '#btnNext', function(){
				if (cntr < lstEl.length - 1) {
					if($('.highlight').hasClass('this')){
						$('.highlight').removeClass('this');
					}
					cntr++;
					$("#countNum").val(cntr+1);
					if (cntr > 0) {
//					      $('#messages').animate({ scrollTop : $(".this").offset().top }, 400);
						$(lstEl[0]).removeClass('current');
					}
					var elm = lstEl[cntr];
					$(elm).addClass('current');
					$(elm).addClass('this');
					var position = $(".this").position(); // 위치값
					$('#messages').animate({ scrollTop : position.top }, 400);
				}else alert("End of search reached!");
			});
				
			$(".mid").on("click", '#btnPrev', function(){
				if (cntr > 0) {
					if($('.highlight').hasClass('this')){
						$('.highlight').removeClass('this');
					}
					cntr--;
					$("#countNum").val(cntr+1);
					if (cntr < lstEl.length) {
						$(lstEl[cntr + 1]).removeClass('current');
					}
					var elm = lstEl[cntr];
					$(elm).addClass('current');
					$(elm).addClass('this');
					var position = $(".this").position(); // 위치값
					$('#messages').animate({ scrollTop : position.top }, 400);
				} else alert("Begining of search!");
			});
				
			jQuery.fn.highlight = function(pat) {
				 function innerHighlight(node, pat) {
				  var skip = 0;
				  if (node.nodeType == 3) {
				   var pos = node.data.toUpperCase().indexOf(pat);
				   pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
				   if (pos >= 0) {
				    var spannode = document.createElement('span');
				    spannode.className = 'highlight';
				    var middlebit = node.splitText(pos);
				    var endbit = middlebit.splitText(pat.length);
				    var middleclone = middlebit.cloneNode(true);
				    spannode.appendChild(middleclone);
				    middlebit.parentNode.replaceChild(spannode, middlebit);
				    skip = 1;
				   }
				  }
				  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
				   for (var i = 0; i < node.childNodes.length; ++i) {
				    i += innerHighlight(node.childNodes[i], pat);
				   }
				  }
				  return skip;
				 }
				 return this.length && pat && pat.length ? this.each(function() {
				  innerHighlight(this, pat.toUpperCase());
				 }) : this;
				};

				jQuery.fn.removeHighlight = function() {
				 return this.find("span.highlight").each(function() {
				  this.parentNode.firstChild.nodeName;
				  with (this.parentNode) {
				   replaceChild(this.firstChild, this);
				   normalize();
				  }
				 }).end();
				};

		    /*
		     * room search autocomplete
		     */
		    $('.mid').on('keyup', '#searchRoomArchive', function(e){
		    	e.preventDefault();
		    	if($(this).val().length<5){
		    		$(this).autocomplete({ disabled: false });
		    		$(this).attr({
		    			autocomplete: "on",
		    			autocapitalize: "on",
		    			autocorrect: "on"
		    		});
			    	var result = [];
				       $('#searchRoomArchive').autocomplete({
				            source: function (request, response) {
				                result = [{
				                	"id"	: 1,
				                    "name"	: "",
				                    "value"	: "			: Searh Message"				                	
				                },{
				                	"id"	: 2,
				                    "name"	: "File:",
				                    "value"	: "File		: Searh Files"
				                }, {
				                	"id"	: 3,
				                    "name"	: "Image:",
				                    "value"	: "Image		: Search Image"
				                }, {
				                	"id"	: 4,
				                    "name"	: "Link:",
				                    "value"	: "Link		: Search Link"
				                }];
				                
				                response(result);
				                return;
				            },
				            select: function (e, ui) {
				            	e.preventDefault();
				            	$('#searchRoomArchive').val(ui.item.name+$('#searchRoomArchive').val());
				            },
				            open: function(event, ui) {
				                $('.ui-autocomplete').prepend('<div class="autoTop">Search Option</div>'); //See all results
				            }
				        });	
		    		
		    	}else{
		    		$(this).autocomplete({ disabled: true });
		    		$(this).attr({
		    			autocomplete: "off",
		    			autocapitalize: "off",
		    			autocorrect: "off"
		    		});
		    	}
		    });

		    /*
		     * 유저 프로필 이미지 전송
		     */
		    $('#leftSection').on("click", "#profile_view", function(e){
		    	if (this === e.target) {
		    		$('#profile_img_input').trigger("click");
		    	}
		    });

		    $('#leftSection').on('change', '#profile_img_input', function(event){
		    	event.preventDefault();
		    	
		        var data = new FormData();
		        var filesList =  document.getElementById('profile_img_input');
		        var randomId = new Date().getTime();
		    
		        for (var i = 0; i < filesList.files.length; i ++) {
		            data.append('userfile', filesList.files[i]);
		        }
		        
		        $.ajax({
		            url			:	"/userProfileImg",	
		            processData	:	false,
		            type		:	'POST',
		            contentType	:	false,
		            data		:	data,
		            datatype	:	"json",
		            success		:	function(data,status,xhr){
		            	$('#profile_view').css('background-image',"url(" + data + "?random=" + randomId + ")");
		            }
		        });
		    });
		    
		    //전체 상세프로필
		   /* $('#mySidenav').on('click', '.profile_detail', function(){*/
			$('#leftbar').on('click', '#searchSec1', function(){
                var id = $(this).attr('id');
				var id= $('.myInfoView').attr("id");
				$(".leftarch, .leftconnection, .leftchat, .container-fluid").hide();
				$(".setInfo").show();
			
                $.ajax({
                    type: "post",
                    url: "/profile",
                    data: { "id":id },
                    success: function(result,status,xhr){
                        $('.setInfo').html(result);
                        $('.setInfo').css('width' ,  $(window).width());
                        $('.setInfo').css('height' ,  $(window).height());
                        $('.dtprofile-background').css('width' ,  $('.setInfo').width()+30);
                        $('.dtprofile-background').css('height' ,  $('.setInfo').height()+30);
                    },
                    error: function(xhr, status, er){}
                });
            });


		    /*상세 프로필*/
/*		    $('.dtprofile-background').on('click', '.emailcl', function(){
		    	$(this).hide();
				$('.email').hide();
				var icon= '<button class="email-edit">EDIT</button>';
			$('.emailad').append(icon);
				
		    });*/
		    
/*		    $('.dtprofile-background').on('click', '.email-edit', function(){
		    	$('.email-edit').remove();
		    	var icon='<button class="setting-close emailcl">CLOSE</button>';
		    	$('.emailad').append(icon);
		    	
		    	var text= '<div class="setting-line email"></div>\
                    <div class="setting-text email">\
                    <div class="inputtext">Current E-mail Address</div>\
	    		       <div class="inputform">\
                    <input type="text" class="form-control" id="emailAdress"></div>\
                    <div class="inputtext">New E-mail Address</div>\
                     <div class="inputform">\
                     <input type="text" class="form-control" id="emailAdress"></div>\
                     <button class="account-message" id="updateEmail">Update E-mail</button></div>';
		    	$('#email-table').append(text);
				
		    });*/
		    
		    
		    $('#leftSection').on('click', '.edit', function(){
		    	$(this).hide();
		    	var id = $(this).attr('id');
		    	if(id=='com'){
		    		$('.userTitle,.userPh,.userPwd,.userDelete').hide();
			    	$('#comcl').show();
			    	$('#company-table').show();
		    	}else if(id=='tit'){
		    		$('.userCompany,.userPh,.userPwd,.userDelete').hide();
		    		$('#ticl').show();
		    		$('#title-table').show();
		    	}else if(id=='ph'){
		    		$('.userCompany,.userTitle,.userPwd,.userDelete').hide();
		    		$('#phcl').show();
		    		$('#phone-table').show();
		    	}else if(id=='pass'){
		    		$('.userCompany,.userTitle,.userPh,.userDelete').hide();
		    		$('#passcl').show();
		    		$('#pass-table').show();
		    	}else if(id='out'){
		    		$('.userCompany,.userTitle,.userPh,.userPwd').hide();
		    		$('#outcl').show();
		    		$('#sign-table').show();
		    	}

		    	
		    });
		    $('#leftSection').on('click', '.setting-close', function(){
		    	$(this).hide();
		    	var id = $(this).attr('id');
		    	$('.userCompany,.userTitle,.userPh,.userPwd,.userDelete').show();
		    	if(id == 'comcl'){
			    	$('#com').show();
			    	$('#company-table').hide();		    		
		    	}else if(id == 'ticl'){
			    	$('#tit').show();
			    	$('#title-table').hide();				    		
		    	}else if(id=='phcl'){
		    		$('#ph').show();
		    		$('#phone-table').hide();
		    	}else if(id=='passcl'){
		    		$('#pass').show();
		    		$('#pass-table').hide();
		    	}else if(id=='outcl'){
		    		$('#out').show();
		    		$('#sign-table').hide();
		    	}
		    });
		    
		    $('#leftSection').on('click', '.account-message', function(){
		    	var id = $(this).attr('id');
		    	var input,pwd;
		    	var state = false;
		    	if(id=='updateCom'){
		    		if($('#currentCom').val() == $('#myCom').text()){
		    			input = $('#newCom').val();
		    			state = true;
		    		}else{
		    			alert('현재 회사와 같지않습니다.');
		    			$('#currentCom').val('');
		    		}
		    	}else if(id=='updateTitle'){
		    		if($('#currentTitle').val() == $('#myTitle').text()){
		    			input = $('#newTitle').val();
		    			state = true;
		    		}else{
		    			alert('현재 직책과 같지않습니다.');
		    			$('#currentTitle').val();
		    		}		    		
		    	}else if(id=='updatePh'){
		    		var regTel = /^(01[016789]{1}|070|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/;
		    		if(!regTel.test($('#newPh').val())){
		    			alert('올바른 전화번호를 입력해주세요. ex) 010-0000-000');
		    		}else{
			    		if($('#currentPh').val() == $('#myPh').text()){
			    			input = $('#newPh').val();
			    			state = true;
			    		}else{
			    			alert('현재 전화번호와 같지않습니다.');
			    		}			    			
		    		}
	    		
		    	}else if(id=='updatePwd'){
		    		pwd = $('#currentPwd').val();
		    		if($('#newPwd').val().length<8 || $('#newPwd').val().length>16){
		    			alert('비밀번호는 최소 8자 이상, 16자 이하');
		    		}else if(/^\d/.test($('#newPwd').val().substr(1).match)){
		    			alert('비밀번호는 숫자로 시작할 수 없습니다.')
		    		}else if(/(\w)\1/.test($('#newPwd').val())){
		    			alert('비밀번호는 반복된 숫자또는 문자를 입력할 수 없습니다.');
		    		}else{
			    		input = $('#newPwd').val();
			    		state = true;		    			
		    		}
		    	}else if(id=='signOut'){
		    		input = $('#outPwd').val();
		    		state = true;
		    	}
		    	
		    	if(state && input != null && input.length != 0){
	                $.ajax({
	                    type: "post",
	                    url: "/profileEdit",
	                    data: { "input": input, "category": id, "pwd":pwd },
	                    success: function(result,status,xhr){
	                        $('#leftSection').html(result);
	                    },
	                    error: function(xhr, status, er){}
	                });		    		
		    	}

		    });
		    
/*		    $('.dtprofile-background').on('click', '.phcl', function(){
		    	$(this).hide();
				$('.ph').hide();
				var icon= '<button class="phone-edit">EDIT</button>';
				$('.phondnm').append(icon);
		    });*/
		    
/*		    $('.dtprofile-background').on('click', '.phone-edit', function(){
		    	$('.phone-edit').remove();
		    	var icon='<button class="setting-close phcl">CLOSE</button>';
		    	$('.phondnm').append(icon);
		    	
		    	var text= '<div class="setting-line ph"></div>\
		    			   <div class="setting-text ph">\
             			   <div class="inputtext">Current Phone number</div>\
				           <div class="inputform">\
					  <select class="form-control" id="emailPhone">\
					  <option>+82</option>\
					  <option>+01</option>\
					  <option>+81</option>\
					  <option>+86</option>\
					  <option>+61</option>\
					  <option>+44</option>\
					  <option>+63</option>\
					  <option>+852</option>\
					  <option>+66</option>\
					  </select>\
					  <input type="text" class="form-control" id="phoneNumber">\
					</div>\
				<div class="inputtext">New Phone number</div>\
					<div class="inputform">\
					  <select class="form-control" id="emailPhone">\
					  <option>+82</option>\
					  <option>+01</option>\
					  <option>+81</option>\
					  <option>+86</option>\
		    		  <option>+61</option>\
					  <option>+44</option>\
					  <option>+63</option>\
					  <option>+852</option>\
					  <option>+66</option>\
					  </select>\
					  <input type="text" class="form-control" id="phoneNumber">\
					</div>\
						<button class="account-message" id="updatePh">Update Phone</button>\
		    		</div>';
		    	$('#phone-table').append(text);
				
		    });*/
		    
		    
		    
/*		    $('.dtprofile-background').on('click', '.pwcl', function(){
		    	$(this).hide();
				$('.pw').hide();
				var icon= '<button class="pass-edit">EDIT</button>';
				$('.passwd').append(icon);
		    });*/
		    
/*		    $('.dtprofile-background').on('click', '.pass-edit', function(){
		    	$('.pass-edit').remove();
		    	var icon='<button class="setting-close pwcl">CLOSE</button>';
		    	$('.passwd').append(icon);
		    	
		    	var text= '<div class="setting-line pw"></div>\
		    			   <div class="setting-text pw">\
		    			   <div class="inputtext">Current E-mail Address</div>\
					       <div class="inputform">\
					       <input type="text" class="form-control" id="emailAdress">\
				           </div>\
				           <div class="inputtext">New E-mail Address</div>\
					       <div class="inputform">\
					       <input type="text" class="form-control" id="emailAdress">\
					       </div>\
						   <button class="account-message" id="updatePwd">Save Password</button></div>';
		    	$('#pass-table').append(text);
		    });*/
		    
		    
/*		    $('.dtprofile-background').on('click', '.socl', function(){
		    	$(this).hide();
				$('.so').hide();
				var icon= '<button class="sign-edit">EDIT</button>';
				$('.signot').append(icon);
		    });
		    
		    $('.dtprofile-background').on('click', '.sign-edit', function(){
		    	$('.sign-edit').remove();
		    	var icon='<button class="setting-close socl">CLOSE</button>';
		    	$('.signot').append(icon);
		    	
		    	var text= '<div class="setting-line so"></div>\
		    		       <div class="setting-text so">\
         			       <div class="inputtext">Confirm your password</div>\
				           <div class="inputform">\
				           <input type="text" class="form-control" id="emailAdress"></div>\
				           <button class="account-signout" id="signOut">Sign out</button></div>';
		    	$('#sign-table').append(text);
		    });*/
		    
		/*    left bar*/
		    
		    /**
		     * 새로운 아카이브 화면
		     */
			$( "#leftbar" ).on( "click", "#archive1", function( event ) {
			    event.preventDefault();
			    $(".leftchat, .setInfo, .leftconnection").hide();
		    	$(".leftarch, .container-fluid").show();
			    $('.leftarch').empty();
			    
		        $.ajax({
		            type: "post",
		            url: "/myArchive",
		            success: function(result,status,xhr){
		            	$(".background").html(result);
		            	/*$('.mid').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
		            	/*$('.archiveback').css('width' ,  $(window).width()-$('#leftSection').width()-$('#rightSection').width());*/
		            	$('.archiveback').css('height', $(window).height() - $('.topMenu').height()-$('.mySection').height());
		            	/*$('.msgbox').css('height', $(window).height() - $('.topSection').height()-$('#plus').height()-$('.topMenu').height());*/
		            	
		            },
		            error: function(xhr, status, er){}
		        });
		        var text= '<div class="left-archive">\
		        	<div class="category" id="ALL"><div id="allfilesmenu"></div><div class="archive-text">ALL FILES</div></div>\
		        	<div class="category" id="ARCHIVE"><div id="archivemunu"></div><div class="archive-text">ARCHIVE</div></div>\
		        	<div class="category" id="GALLERY"><div id="gallerymenu"></div><div class="archive-text">GALLERY</div></div></div>';
		        $('.leftarch').append(text);

			});
			
			$( ".leftarch" ).on( "click", ".category", function( event ) {
				$('.category').css({color:  '#455A64'});
				$(this).css({color:  '#4A7DFF'});
			});
			
			
			
			/*
			 * 알람 뷰
			 */
/*			$( "#leftbar" ).on( "click", "#dropAlarm", function( event ) {
			    event.preventDefault();
			    
		        $.ajax({
		            type: "post",
		            url: "/alarm",
		            success: function(result,status,xhr){
		            	$(".alarm-drop").html(result);
		            },
		            error: function(xhr, status, er){}
		        });

			});*/
			
			
			  /*
		     * 우측 상단에 파일 검색이나 메시지 로그 검색
		     */
/*		    $('#leftbar').on('click', '#searchSec1', function(e){
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
		    });*/
		    
		    /*
		     * 좌측에서 친구 리스트 가져옴
		     */
		    $('#leftbar').on("click","#getcontacts1",function(e) {
		    	$(".leftarch, .leftconnection").hide();
		    	$('.dtprofile-background, #relationResult').remove();
                $('.setInfo').css('width' ,  0);
                $('.setInfo').css('height' ,  0);
		    	$(".leftchat, .container-fluid").show();
		    	
		    	$('#topcontacts').text('CONTACTS');
		        $.ajax({
		            type: "post",
		            url: "/leftmenu",
		            success: function(result,status,xhr){
		            	$(".leftchat").html(result);
		            	$('#friendlist').css('height' ,  $(window).height()-$('#topcontacts').height()-$('.myInfo').height()-$('#inputSearchMember').height()-10);
		            },
		            error: function(xhr, status, er){}
		        });
		        e.preventDefault();
		    });
		    
		    /*
			 * 왼쪽 방 정보 가져오기.
			 */
		    $('#leftbar').on("click","#getmessages1",function(){
		    	$(".leftarch, .leftconnection,.myInfo").hide();
		    	$('.dtprofile-background, #relationResult').remove();
                $('.setInfo').css('width' ,  0);
                $('.setInfo, .category, .leftarch').css('height' ,  0);
		    	$(".leftchat, .container-fluid").show();
		    	$('#topcontacts').text('ROOMS');
		    	$('#inputSearchMember').attr("placeholder","");
		    	socket.emit('rooms', $('#leftSection').attr('class'));
		    	$('.searchResult,#room-list').css('height' ,  $(window).height()-$('#topcontacts').height()-$('.myInfo').height()-$('#inputSearchMember').height()-10 );
//				setInterval(function() {
//					socket.emit('rooms', $('.myInfoView').attr("id"));
//			    }, 10000);
		    });
		    
		    
		    /*
		     * room archive mouseover
		     */
		    $('.mid').on("mouseenter","#roomA",function(e) {
		    	$("#roomArchive").css('background-color',"#cfd8dc");
		    	$("#roomArchive").css('border').remove();
		    });
		    
		    $('.mid').on("mouseleave","#roomA",function(e) {
		    	$("#roomArchive").css('background-color',"white");
		    	$("#roomArchive").css('border', "none");
		    });
		    
		    /*
		     * room gallery mouseover
		     */
		    $('.mid').on("mouseenter","#roomG",function(e) {
		    	$("#roomGallery").css('background-color',"#cfd8dc");
		    	$("#roomGallery").css('border').remove();
		    });
		    
		    $('.mid').on("mouseleave","#roomG",function(e) {
		    	$("#roomGallery").css('background-color',"white");
		    	$("#roomGallery").css('border', "none");
		    });
		    
		    
		    /*
		     * room link mouseover
		     */
		    $('.mid').on("mouseenter","#roomL",function(e) {
		    	$("#roomLinks").css('background-color',"#cfd8dc");
		    	$("#roomLinks").css('border').remove();
		    });
		    
		    $('.mid').on("mouseleave","#roomL",function(e) {
		    	$("#roomLinks").css('background-color',"white");
		    	$("#roomLinks").css('border', "none");
		    });
		    
/*		    $('#leftbar').on("mouseenter", ".rightback", function(e){
		    	
		    	$(this).css('background-color', "#1f61a2");
		    });
		    $('#leftbar').on("mouseleave", ".rightback", function(e){
		    	
		    	$(this).css('background-color',"#4a7dff");
		    });*/
		    $('#leftbar').on("mouseenter", ".rightbacksub", function(e){
		    	
		    	$(this).css('background-color', "#1f61a2");
		    });
		    $('#leftbar').on("mouseleave", ".rightbacksub", function(e){
		    	
		    	;$(this).css('background-color',"#4a7dff");
		    })
		    
		    

});
