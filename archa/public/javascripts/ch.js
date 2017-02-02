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
        var msglength = msg.message.length;
        var text= '<div class="message_box_send">\
                                <div id="me_image" class="message_sender" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
                                <div class="talk talks me" id="'+msg.email+'">\
                                	<div id="talkname">'+msg.name+'</div><span class="message_body"></span>\
                                </div>\
                                <div class="message_date" id="'+msg.mdate+'"></div>\
                          </div></br>';
        return text;
	}
    function nearMe(msg){
        var text= '<div class="message_box_send">\
                                <div class="talk talks me" id="'+msg.email+'"><span class="message_body"></span></div>\
                                <div class="message_date" id="'+msg.mdate+'"></div>\
                          </div></br>';
        return text;
	}	
	function other(msg){
		return '<div class="message_box_re">\
					<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="talk talks other" id="'+msg.email+'"><div id="talkother">'+msg.name+'</div><span class="message_body"></span></div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}
	function nearOther(msg){
		return '<div class="message_box_re">\
					<div class="talk talks other" id="'+msg.email+'"><span class="message_body"></span></div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}	
	function myYoutube(msg,meta){
		return '<div class="message_box_send">\
		 <div id="me_image" class="message_sender" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="talk link ma" id="'+msg.email+'">\
					<div id="talkname">'+msg.name+'</div><<span class="message_body"></span>/div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>\
				<iframe class="talk link me"\
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></br>';
	}  
	function nearMyYoutube(msg,meta){
		return '<div class="message_box_send">\
					<div id="me_image" class="message_sender" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="talk link ma" id="'+msg.email+'">\
					<div id="talkname">'+msg.name+'</div><span class="message_body"></span></div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>\
				<iframe class="talk link me"\
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></div></br>';
	}
	function otherYoutube(msg,meta){
		return '<div class="message_box_re">\
					<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="talk link other" id="'+msg.email+'">\
					<div id="talkother">'+msg.name+'</div><span class="message_body"></span></div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>\
				<iframe class="talk link other"\
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></div></br>';
	}
	function nearOtherYoutube(msg,meta){
		return '<div class="message_box_re">\
					<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="talk talks other" id="'+msg.email+'">\
					<div id="talkother">'+msg.name+'</div><span class="message_body"></span></div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>\
				<iframe class="talk link other"\
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></div></br>';
	}	
	function myUrl(msg,meta){
		var text =  '<div class="message_box_send">\
						<div id="me_image" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
						<div class="talk link ma" id="'+msg.email+'">\
						<div id="talkname">'+msg.name+'</div>\
						<span class="message_body"></span></div>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					<div class="talk link ma" id="'+msg.email+'">\
						<a class="urlrow" href="'+meta.data.ogUrl+'" target="_blank">\
							<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
							<span class="urltitle" style="float:right;" >'+meta.data.ogTitle+'</span>\
						</a>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					</div></div><br/>';
		return text;
		
	}
	function nearMyUrl(msg,meta){
		var text =  '<div class="message_box_send">\
			<div id="me_image" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div><div class="talk talks me" id="'+msg.email+'">\
			<div id="talkname">'+msg.name+'</div>\
			<span class="message_body"></span></div>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					<div class="talk link ma" id="'+msg.email+'">\
						<a class="urlrow" href="'+meta.data.ogUrl+'" target="_blank">\
							<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
							<span class="urltitle" style="float:right;" >'+meta.data.ogTitle+'</span>\
						</a>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					</div></div><br/>';
		return text;
		
	}
	function otherUrl(msg,meta){
		return '<div class="message_box_re">\
		<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="talk talks other" id="'+msg.email+'">\
					<div id="talkother">'+msg.name+'</div>\
					<span class="message_body"></span></div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div>\
				<div class="talk link other" id="'+msg.email+'">\
					<a class="urlrow" href="'+meta.data.ogUrl+'" target="_blank">\
						<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
						<span class="urltitle" style="float:left;" >'+meta.data.ogTitle+'</span>\
					</a>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}
	function nearOtherUrl(msg,meta){
		return '<div class="message_box_re">\
		<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+msg.email+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div><div class="talk talks other" id="'+msg.email+'">\
		<div id="talkother">'+msg.name+'</div>\
		<span class="message_body"></span></div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div>\
				<div class="talk link other" id="'+msg.email+'">\
					<a class="urlrow" href="'+meta.data.ogUrl+'" target="_blank">\
						<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
						<span class="urltitle" style="float:left;" >'+meta.data.ogTitle+'</span>\
					</a>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}
	function myData(data,send_userEmail,send_userName){
		var text ="";
		if(data.type == 'pptx'){
			text= "pptximage";			
		}
		if(data.type =='xlsx'){
			text= "xlsximage";
		}
		if(data.type =='pdf'){
			text= "pdfimage";
		}
		if(data.type =='docx'){
			text= "docximage";
		}
		return '<div class="file_box_send sendData">\
				 <div id="me_image" class="message_sender" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+send_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
				 <div class="myfileimage file me" id="'+send_userEmail+'"><div id="imagename">'+send_userName+'</div>\
					<div class="url"><div class='+text+'></div></div>\
								<a href="'+data.url+'" target="'+data.url+'"> \
								<div class="file_container"> \
									<div class="file_name" >'+data.name+'</div> \
									<div class="meta_size" >'+bytesToSize(data.size)+'  '+ data.type+'</div>\
								</div>\
							</a>\
						</div>\
						<div class="message_date" id="'+data.date+'"></div>\
					</div></br>';
	}
	function nearMyData(data,send_userEmail,send_userName){
		var text ="";
		if(data.type == 'pptx'){
			text= "pptximage";			
		}
		if(data.type =='xlsx'){
			text= "xlsximage";
		}
		if(data.type =='pdf'){
			text= "pdfimage";
		}
		if(data.type =='docx'){
			text= "docximage";
		}
		return '<div class="file_box_send sendData">\
				<div id="me_image" class="message_sender" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+send_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					 <div class="myfileimage file me" id="'+send_userEmail+'"><div id="imagename">'+send_userName+'</div>\
						<div class="url"><div class='+text+'></div></div>\
									<a href="'+data.url+'" target="'+data.url+'"> \
									<div class="file_container"> \
										<div class="file_name" >'+data.name+'</div> \
										<div class="meta_size" >'+bytesToSize(data.size)+'  '+ data.type+'</div>\
									</div>\
								</a>\
							</div>\
							<div class="message_date" id="'+data.date+'"></div>\
						</div></br>';
	}	
	function otherData(data,re_userEmail,re_userName){
		var text ="";
		if(data.type == 'pptx'){
			text= "pptximage";			
		}
		if(data.type =='xlsx'){
			text= "xlsximage";
		}
		if(data.type =='pdf'){
			text= "pdfimage";
		}
		if(data.type =='docx'){
			text= "docximage";
		}
		if(data.type =='zip'){
			text= "zipimage";
		}
		return '<div class="file_box_re reData">\
					<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+re_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="otherfileimage file other" id="'+re_userEmail+'"><div id="otherimagename">'+re_userName+'</div>\
					<div class="url"><div class='+text+'></div></div>\
							<a href="'+data.url+'" target="'+data.url+'"> \
							<div class="file_container"> \
							<div class="file_name" >'+data.name+'</div> \
							<div class="meta_size" >'+bytesToSize(data.size)+'  '+ data.type+'</div>\
							</div>\
						</a>\
					</div>\
					<div class="message_date" id="'+data.date+'"></div>\
				</div>';
	}
	function nearOtherData(data,re_userEmail,re_userName){
		var text ="";
		if(data.type == 'pptx'){
			text= "pptximage";			
		}
		if(data.type =='xlsx'){
			text= "xlsximage";
		}
		if(data.type =='pdf'){
			text= "pdfimage";
		}
		if(data.type =='docx'){
			text= "docximage";
		}
		if(data.type =='zip'){
			text= "zipimage";
		}
		return '<div class="file_box_re reData">\
					<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+re_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="otherfileimage file other" id="'+re_userEmail+'"><div id="otherimagename">'+re_userName+'</div>\
				<div class="url"><div class='+text+'></div></div>\
						<a href="'+data.url+'" target="'+data.url+'"> \
						<div class="file_container"> \
						<div class="file_name" >'+data.name+'</div> \
						<div class="meta_size" >'+bytesToSize(data.size)+'  '+ data.type+'</div>\
						</div>\
					</a>\
				</div>\
				<div class="message_date" id="'+data.date+'"></div>\
			</div>';
	}	
	function myImage(data,send_userEmail,send_userName){
		return '<div class="message_box_send sendData">\
				 <div id="me_image" class="message_sender" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+send_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
				 <div class="myimage images me" id="'+send_userEmail+'"><div id="imagename">'+send_userName+'</div>\
					<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" class="dataImage" data-link-url="'+data.url+'">\
						<div class="dataImageBody">\
							<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'">\
						</div>\
					</a>\
				 </div>\
				 <div class="message_date" id="'+data.date+'"></div>\
						</div></br>';
	}
	function nearMyImage(data,send_userEmail,send_userName){
		return '<div class="message_box_send sendData">\
				<div id="me_image" class="message_sender" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+send_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					 <div class="myimage images me" id="'+send_userEmail+'"><div id="imagename">'+send_userName+'</div>\
							<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" class="dataImage" data-link-url="'+data.url+'">\
								<div class="dataImageBody">\
									<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'">\
								</div>\
							</a>\
					 </div>\
					 <div class="message_date" id="'+data.date+'"></div>\
				</div></br>';
	}
	function otherImage(data,re_userEmail,re_userName){
		return '<div class="message_box_re reData">\
					<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+re_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
			 		<div class="otherimage images other" id="'+re_userEmail+'"><div id="otherimagename">'+re_userName+'</div>\
						<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" class="image_file_body" data-link-url="'+data.url+'">\
							<div class="image_preserve_aspect_ratio">\
								<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'"\>\
							</div>\
						</a>\
					</div>\
					<div class="message_date" id="'+data.date+'"></div>\
				</div></br>';
	}
	function nearOtherImage(data,re_userEmail,re_userName){
		return '<div class="message_box_re reData">\
				<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+re_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
			 		<div class="otherimage images other" id="'+re_userEmail+'"><div id="otherimagename">'+re_userName+'</div>\
						<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" style="width: 50%;" class="image_file_body" data-link-url="'+data.url+'">\
							<div class="image_preserve_aspect_ratio">\
								<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'"\>\
							</div>\
						</a>\
					</div>\
					<div class="message_date" id="'+data.date+'"></div>\
				</div></br>';
	}	
	socket = io.connect({
        'reconnection': true,
        'reconnectionDelay': 1000,
        'reconnectionDelayMax' : 5000,
        'reconnectionAttempts': 5
	});
	socket.emit('myId', $('.myInfoView').attr("id"));
	socket.on('disconnect', function() {
		socket.io.reconnect();
	});
    socket.on('reconnect', function() {
        console.log('reconnect fired!');
    });
	socket.on('my message', function (msg) {
    	if($('#messages').children('div').index() > -1){
    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
    		var nowDate = new Date(msg.mdate);
    		var cal = new Date(nowDate-preDate);
    		var day;
			switch(nowDate.getDay()){
				case 0		: day = 'Sunday'; break;
				case 1		: day = 'Monday'; break;
				case 2		: day = 'Tuesday'; break;
				case 3		: day = 'Wednesday'; break;
				case 4		: day = 'Thursday'; break;
				case 5		: day = 'Friday'; break;
				case 6		: day = 'Saturday'; break;
			};
			if(cal.getDate()!=1){
				$('#messages').append('<div class="newdate"><div class="icon-clock fleft"></div>'+nowDate.getFullYear().toString()+'.'+(nowDate.getMonth()+1).toString()+'.'+nowDate.getDate().toString()+' '+day+'</div>');
			}
    		if($('#messages').children('div').last().children('.talk').attr('id') == msg.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
    			$('#messages').append(nearMe(msg));
    		}else{
        		$('#messages').append(me(msg));	   			
    		}
    	}else{
    		$('#messages').append(me(msg));	
    	}
    	$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(msg.message))
    	$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	
	socket.on('other message', function (msg) {
    	if($('#messages').children('div').index() > -1){
    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
    		var nowDate = new Date(msg.mdate);
    		var cal = new Date(nowDate-preDate);
    		var day;
			switch(nowDate.getDay()){
				case 0		: day = 'Sunday'; break;
				case 1		: day = 'Monday'; break;
				case 2		: day = 'Tuesday'; break;
				case 3		: day = 'Wednesday'; break;
				case 4		: day = 'Thursday'; break;
				case 5		: day = 'Friday'; break;
				case 6		: day = 'Saturday'; break;
			};
			if(cal.getDate()!=1){
				$('#messages').append('<div class="newdate"><div class="icon-clock fleft"></div>'+nowDate.getFullYear().toString()+'.'+(nowDate.getMonth()+1).toString()+'.'+nowDate.getDate().toString()+' '+day+'</div>');
			}
    		if($('#messages').children('div').last().children('.talk').attr('id') == msg.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
    			$('#messages').append(nearOther(msg));
    		}else{
        		$('#messages').append(other(msg));	   			
    		}
    	}else{
    		$('#messages').append(other(msg));	
    	}
    	$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(msg.message))
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});

	socket.on('my message youtube', function(msg,meta){
		console.log('myUrl');
		var me = $("#userId").val();
		if(me == msg.name){
	    	if($('#messages').children('div').index() > -1){
	    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
	    		var nowDate = new Date(msg.mdate);
	    		var cal = new Date(nowDate-preDate);
	    		var day;
				switch(nowDate.getDay()){
					case 0		: day = 'Sunday'; break;
					case 1		: day = 'Monday'; break;
					case 2		: day = 'Tuesday'; break;
					case 3		: day = 'Wednesday'; break;
					case 4		: day = 'Thursday'; break;
					case 5		: day = 'Friday'; break;
					case 6		: day = 'Saturday'; break;
				};
				if(cal.getDate()!=1){
					$('#messages').append('<div class="newdate"><div class="icon-clock fleft"></div>'+nowDate.getFullYear().toString()+'.'+(nowDate.getMonth()+1).toString()+'.'+nowDate.getDate().toString()+' '+day+'</div>');
				}
	    		if($('#messages').children('div').last().children('.talk').attr('id') == msg.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
	    			$('#messages').append(nearMyYoutube(msg,meta));
	    		}else{
	        		$('#messages').append(myYoutube(msg,meta));	   			
	    		}
	    	}else{
	    		$('#messages').append(myYoutube(msg,meta));
	    	}
	    	$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(msg.message))
			$('#messages').scrollTop($('#messages').prop('scrollHeight'));
		}		
	});
	
	socket.on('other message youtube', function(msg, meta){
    	if($('#messages').children('div').index() > -1){
    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
    		var nowDate = new Date(msg.mdate);
    		var cal = new Date(nowDate-preDate);
    		var day;
			switch(nowDate.getDay()){
				case 0		: day = 'Sunday'; break;
				case 1		: day = 'Monday'; break;
				case 2		: day = 'Tuesday'; break;
				case 3		: day = 'Wednesday'; break;
				case 4		: day = 'Thursday'; break;
				case 5		: day = 'Friday'; break;
				case 6		: day = 'Saturday'; break;
			};
			if(cal.getDate()!=1){
				$('#messages').append('<div class="newdate"><div class="icon-clock fleft"></div>'+nowDate.getFullYear().toString()+'.'+(nowDate.getMonth()+1).toString()+'.'+nowDate.getDate().toString()+' '+day+'</div>');
			}
    		if($('#messages').children('div').last().children('.talk').attr('id') == msg.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
    			$('#messages').append(nearOtherYoutube(msg,meta));
    		}else{
        		$('#messages').append(otherYoutube(msg,meta));	   			
    		}
    	}else{
    		$('#messages').append(otherYoutube(msg,meta));	
    	}
    	$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(msg.message))
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	
	socket.on('my message url', function (msg,meta) {
		var me = $("#userId").val();
		if(me == msg.name){
	    	if($('#messages').children('div').index() > -1){
	    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
	    		var nowDate = new Date(msg.mdate);
	    		var cal = new Date(nowDate-preDate);
	    		var day;
				switch(nowDate.getDay()){
					case 0		: day = 'Sunday'; break;
					case 1		: day = 'Monday'; break;
					case 2		: day = 'Tuesday'; break;
					case 3		: day = 'Wednesday'; break;
					case 4		: day = 'Thursday'; break;
					case 5		: day = 'Friday'; break;
					case 6		: day = 'Saturday'; break;
				};
				if(cal.getDate()!=1){
					$('#messages').append('<div class="newdate"><div class="icon-clock fleft"></div>'+nowDate.getFullYear().toString()+'.'+(nowDate.getMonth()+1).toString()+'.'+nowDate.getDate().toString()+' '+day+'</div>');
				}
	    		if($('#messages').children('div').last().children('.talk').attr('id') == msg.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
	    			$('#messages').append(nearMyUrl(msg,meta));
	    		}else{
	        		$('#messages').append(myUrl(msg,meta));	
	    		}
	    	}else{
	    		$('#messages').append(myUrl(msg,meta));
	    	}
	    	$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(msg.message))
			$('#messages').scrollTop($('#messages').prop('scrollHeight'));
		}
	});
	
	socket.on('other message url', function (msg,meta) {
    	if($('#messages').children('div').index() > -1){
    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
    		var nowDate = new Date(msg.mdate);
    		var cal = new Date(nowDate-preDate);
    		var day;
			switch(nowDate.getDay()){
				case 0		: day = 'Sunday'; break;
				case 1		: day = 'Monday'; break;
				case 2		: day = 'Tuesday'; break;
				case 3		: day = 'Wednesday'; break;
				case 4		: day = 'Thursday'; break;
				case 5		: day = 'Friday'; break;
				case 6		: day = 'Saturday'; break;
			};
			if(cal.getDate()!=1){
				$('#messages').append('<div class="newdate"><div class="icon-clock fleft"></div>'+nowDate.getFullYear().toString()+'.'+(nowDate.getMonth()+1).toString()+'.'+nowDate.getDate().toString()+' '+day+'</div>');
			}
    		if($('#messages').children('div').last().children('.talk').attr('id') == msg.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
    			$('#messages').append(nearOtherUrl(msg,meta));
    		}else{
        		$('#messages').append(otherUrl(msg,meta));	   			
    		}
    	}else{
    		$('#messages').append(otherUrl(msg,meta));
    	}
    	$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(msg.message))
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});

	socket.on('my data', function(data,send_userEmail,send_userName){
		var mdata;
		
    	if($('#messages').children('div').index() > -1){
    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
    		var nowDate = new Date(data.date);
    		var cal = new Date(nowDate-preDate);
    		var day;
			switch(nowDate.getDay()){
				case 0		: day = 'Sunday'; break;
				case 1		: day = 'Monday'; break;
				case 2		: day = 'Tuesday'; break;
				case 3		: day = 'Wednesday'; break;
				case 4		: day = 'Thursday'; break;
				case 5		: day = 'Friday'; break;
				case 6		: day = 'Saturday'; break;
			};
			if(cal.getDate()!=1){
				$('#messages').append('<div class="newdate"><div class="icon-clock fleft"></div>'+nowDate.getFullYear().toString()+'.'+(nowDate.getMonth()+1).toString()+'.'+nowDate.getDate().toString()+' '+day+'</div>');
			}
    		if($('#messages').children('div').last().children('.talk').attr('id') == send_userEmail && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
    			if(data.rtype != 'image'){
    				mdata = nearMyData(data,send_userEmail,send_userName);
    			}else{
    				mdata = nearMyImage(data,send_userEmail,send_userName);
    			}
    		}else{
    			if(data.rtype != 'image'){
    				mdata = myData(data,send_userEmail,send_userName);
    			}else{
    				mdata = myImage(data,send_userEmail,send_userName);
    			} 			
    		}
    	}else{
    		if(data.rtype != 'image'){
    			mdata = myData(data,send_userEmail,send_userName);
    		}else{
    			mdata = myImage(data,send_userEmail,send_userName);
    		}
    	}
		$('#messages').append(mdata);
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	
	socket.on('other data', function(data,send_userEmail,send_userName){
		var odata;
		
    	if($('#messages').children('div').index() > -1){
    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
    		var nowDate = new Date(data.date);
    		var cal = new Date(nowDate-preDate);
    		var day;
			switch(nowDate.getDay()){
				case 0		: day = 'Sunday'; break;
				case 1		: day = 'Monday'; break;
				case 2		: day = 'Tuesday'; break;
				case 3		: day = 'Wednesday'; break;
				case 4		: day = 'Thursday'; break;
				case 5		: day = 'Friday'; break;
				case 6		: day = 'Saturday'; break;
			};
			if(cal.getDate()!=1){
				$('#messages').append('<div class="newdate"><div class="icon-clock fleft"></div>'+nowDate.getFullYear().toString()+'.'+(nowDate.getMonth()+1).toString()+'.'+nowDate.getDate().toString()+' '+day+'</div>');
			}
    		if($('#messages').children('div').last().children('.talk').attr('id') == send_userEmail && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
    			if(data.rtype != 'image'){
    				odata = nearOtherData(data,send_userEmail,send_userName);
    			}else{
    				odata = nearOtherImage(data,send_userEmail,send_userName);
    			}
    		}else{
    			if(data.rtype != 'image'){
    				odata = otherData(data,send_userEmail,send_userName);
    			}else{
    				odata = otherImage(data,send_userEmail,send_userName);
    			}		
    		}
    	}else{
    		if(data.rtype != 'image'){
    			odata = otherData(data,send_userEmail,send_userName);
    		}else{
    			odata = otherImage(data,send_userEmail,send_userName);
    		}
    	}
    	
		$('#messages').append(odata);
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	
	socket.on('roomLoad', function(email, room,data){
		var msg;
		var mdata, odata;
		var chk;
		var temp;
		var day;
		room.messagelog.forEach(function(val, i){
			if(i!=0){
				var testDate = new Date(val.mdate);
				var tempDate = new Date(temp.mdate);
				var cal = new Date(testDate-tempDate);
				switch(testDate.getDay()){
					case 0		: day = 'Sunday'; break;
					case 1		: day = 'Monday'; break;
					case 2		: day = 'Tuesday'; break;
					case 3		: day = 'Wednesday'; break;
					case 4		: day = 'Thursday'; break;
					case 5		: day = 'Friday'; break;
					case 6		: day = 'Saturday'; break;
				};
				if(cal.getDate()!=1){
					$('#messages').append('<div class="newdate"><div class="icon-clock fleft"></div>'+testDate.getFullYear().toString()+'.'+(testDate.getMonth()+1).toString()+'.'+testDate.getDate().toString()+' '+day+'</div>');
				} 
					
			}
			if(val.mtype == 'text'){
				if(val.email == email){
					if(i!=0 && val.email == temp.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
						$('#messages').append(nearMe(val));
					}else{
						$('#messages').append(me(val));
					}
					$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(val.message))
					$('#messages').scrollTop($('#messages').prop('scrollHeight'));	
				}else{
					if(i!=0 && val.email == temp.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
						$('#messages').append(nearOther(val));					
					}else{
						$('#messages').append(other(val));				
					}
					$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(val.message))
					$('#messages').scrollTop($('#messages').prop('scrollHeight'));
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
							}else{
								if(dv.rtype == 'image'){
									mdata = myImage(dv, dv.send_id.email, dv.send_id.name);
								}else{
									mdata = myData(dv, dv.send_id.email, dv.send_id.name);
								}
								$('#messages').append(mdata);							
							}
							$('#messages').scrollTop($('#messages').prop('scrollHeight'));
						}
					});
				}else{
					$.each(data, function(j, dv){
						if(dv.name == val.message && dv.send_id.email == val.email && dv.date == val.mdate){
							if(i!=0 && val.email == temp.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
								if(dv.rtype == 'image'){
									odata = nearOtherImage(dv, dv.send_id.email, dv.send_id.name);
								}else{
									odata = nearOtherData(dv, dv.send_id.email, dv.send_id.name);
								}
								$('#messages').append(odata);								
							}else{
								if(dv.rtype == 'image'){
									odata = otherImage(dv, dv.send_id.email, dv.send_id.name);
								}else{
									odata = otherData(dv, dv.send_id.email, dv.send_id.name);
								}
								$('#messages').append(odata);							
							}
							$('#messages').scrollTop($('#messages').prop('scrollHeight'));
						}
					});
				}
			}else if(val.mtype == 'url'){
				if(val.email == email){
					if(i!=0 && val.email == temp.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
						$('#messages').append(nearMyUrlHead(val,i));						
					}else{
						$('#messages').append(myUrlHead(val,i));						
					}
					$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(val.message))
					$('#messages').scrollTop($('#messages').prop('scrollHeight'));
					socket.emit('getOgData', val,i);
				}else{
					if(i!=0 && val.email == temp.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
						$('#messages').append(nearOtherUrlHead(val,i));						
					}else{
						$('#messages').append(otherUrlHead(val,i));						
					}
					$('#messages').children('div').last().children('.talk').children('.message_body').append(document.createTextNode(val.message))
					$('#messages').scrollTop($('#messages').prop('scrollHeight'));
					socket.emit('getOgData', val,i);					
				}
			}
			temp = val;
			if(jQuery.inArray(email,val.readby) == -1){
				chk = 1;
				val.readby.push(email);
			}
			if(i == room.messagelog.length-1){
				$('#messages').scrollTop($('#messages').prop('scrollHeight'));
			}
			
		});
		
		if(chk){
			socket.emit('readMessageSave', room);
			if( $('[id="'+room.id+'"]').length > 0){
				$('[id="'+room.id+'"]').text(0);
			}
		}
		
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});

	socket.on('ogData', function(meta,url, sendEmail, me,i,val){
		if(sendEmail == me){
			$('#messages').children('[id="'+i+'"]').append(myUrlMeta(meta,me,val));
		}else{
			$('#messages').children('[id="'+i+'"]').append(otherUrlMeta(meta,me,val));
		}
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	socket.on('youOgData', function(meta, url, sendEmail, me, i,val){
		if(sendEmail == me){
			$('#messages').children('[id="'+i+'"]').append(myYoutubeMeta(meta,me,val));
		}else{
			$('#messages').children('[id="'+i+'"]').append(otherYoutubeMeta(meta,me,val));
		}
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	});
	function myUrlHead(msg,i){
		var text =  '<div class="message_box_send" id='+i+'>\
						<div id="me_image" class="message_sender" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+re_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
						<div class="talk link ma" id="'+msg.email+'">\
						<div id="talkname">'+msg.name+'</div>'+msg.message+'</div>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					</div><br/>';
		return text;
	}
	function nearMyUrlHead(msg,i){
		var text =  '<div class="message_box_send" id='+i+'>\
					 <div id="me_image" class="message_sender" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+re_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
						<div class="talk link ma" id="'+msg.email+'">\
						<div id="talkname">'+msg.name+'</div>'+msg.message+'</div>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					</div><br/>';
		return text;
	}
	function myUrlMeta(meta,me,val){
		var text =  '<div class="talk link me" id="'+me+'">\
						<div class="urlrow" href="'+(meta.data.ogUrl == undefined ? val.url : meta.data.ogUrl)+'" target="_blank">\
							<img class="imgUrl" src="'+(meta.data.ogImage.url == undefined ? 'https://www.google.com/s2/favicons?domain='+val.url:meta.data.ogImage.url)+'"/>\
							<span class="urltitle" style="float:right;" >'+(meta.data.ogDescription == undefined && meta.data.ogTitle != undefined ? meta.data.ogTitle : meta.data.ogDescription )+'</span>\
						</div>\
						<div class="message_date" id="'+val.mdate+'"></div>\
					</div></br>';			

		return text;
	}
	
	function otherUrlHead(msg,i){
		return '<div class="message_box_re" id='+i+'>\
				<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+re_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="talk link other" id="'+msg.email+'">\
					<div id="talkother">'+msg.name+'</div>'+msg.message+'</div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}
	function nearOtherUrlHead(msg,i){
		return '<div class="message_box_re" id='+i+'>\
				<div id="other_image" class="message_re" style="background-image: url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+re_userEmail+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png);"></div>\
					<div class="talk link other" id="'+msg.email+'">\
					<div id="talkother">'+msg.name+'</div>'+msg.message+'</div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}
	function otherUrlMeta(meta,me,val){
		return '<div class="talk link other" id="'+me+'">\
					<div class="urlrow" href="'+meta.data.ogUrl+'" target="_blank">\
						<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
						<span class="urltitle" style="float:left;" >'+meta.data.ogTitle+'</span>\
					</div>\
					<div class="message_date" id="'+val.mdate+'"></div>\
				</div></br>';
	}
	function myYoutubeMeta(meta,me){
		return '<iframe class="talk link me" \
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></br>';
	}
	function otherYoutubeMeta(meta,me){
		return '<iframe class="talk link other" \
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></br>';
	}	
	socket.on('roomInfoImage', function(users){
		var roomInfo = $.grep(users, function( a ) {
	      	  return a !== $('.myInfoView').attr("id");
	    });
		
        if(roomInfo.length==1){
        	$('.room-info-image').css({'background-image':'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomInfo[0]+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
        }else if(roomInfo.length==2){
        	$('.room-info-image').css({'background-image':'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomInfo[0]+'/userProfileImg/user_profile_img.png), url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomInfo[1]+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
        	$('.room-info-image').css({'background-position':'left, right,left, right'});
        	$('.room-info-image').css({'background-size':'50% 100%'});
        }else if(roomInfo.length>=3){
        	$('.room-info-image').css({'background-image':
        		'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomInfo[0]+'/userProfileImg/user_profile_img.png),\
        		url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomInfo[1]+'/userProfileImg/user_profile_img.png),\
        		url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomInfo[2]+'/userProfileImg/user_profile_img.png),\
        		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png),\
        		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png),\
        		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
        	$('.room-info-image').css({'background-position':'left top, right top, bottom left,left top, right top, bottom left'});
        	$('.room-info-image').css({'background-size':'50% 50%'});
        }   
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
/*		$('.userInfo').append('<div class="'+users[0]+'" id="chativ">invite</div>');       추가    
		users.forEach(function(users, index){
			if(users == $('.myInfoView').attr("id")) $('#me').val(users);
			else $('#you').val(users);
			text = '<li role="presentation"><a role="menuitem" tabindex="-1" data-target="#">'+users+'</a></li>'
			$('.userInfo').append(text);
		});
        $('.userInfo').append('<div id="close"><a>CLOSE</a></div>');	      추가  */
		users.forEach(function(users,index){
			if(users == $('.myInfoView').attr("id")) $('#me').val(users);
			else $('#you').val(users);
		});
		var roomTitle = $.grep(users, function( a ) {
      	  return a !== $('.myInfoView').attr("id");
        });
        if(roomTitle.length==1){
        	$('[class="myRoom-title-img"]').css({'background-image':'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[0]+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
        }else if(roomTitle.length==2){
        	$('[class="myRoom-title-img"]').css({'background-image':'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[0]+'/userProfileImg/user_profile_img.png), url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[1]+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
        	$('[class="myRoom-title-img"]').css({'background-position':'left, right,left, right'});
        	$('[class="myRoom-title-img"]').css({'background-size':'50% 100%'});
        }else if(roomTitle.length>=3){
        	$('[class="myRoom-title-img"]').css({'background-image':
        		'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[0]+'/userProfileImg/user_profile_img.png),\
        		url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[1]+'/userProfileImg/user_profile_img.png),\
        		url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[2]+'/userProfileImg/user_profile_img.png),\
        		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png),\
        		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png),\
        		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
        	$('[class="myRoom-title-img"]').css({'background-position':'left top, right top, bottom left,left top, right top, bottom left'});
        	$('[class="myRoom-title-img"]').css({'background-size':'50% 50%'});
        }       
	});
	
    //상단바 여기서 조정 후 멤버들에게 방 재입장 보냄
    // socket.join(new)
    socket.on('roomChange', function(thisRoom, users, name){
    	$('.dropdown').show();
    	$('#room-image').text(users.length);
		$('#users').empty();
		$('.userInfo').empty();
		$('#room').val(name);
		$('#thisRoom').val(thisRoom);
		$('#joinRoom').val(thisRoom);
/*		users.forEach(function(users, index){
			if(users == $('.myInfoView').attr("id")) $('#me').val(users);
			else $('#you').val(users);
			text = '<li role="presentation"><a role="menuitem" tabindex="-1" data-target="#">'+users+'</a></li>'
			$('.userInfo').append(text);
		});
        $('.userInfo').append('<div id="close"><a>CLOSE</a></div>');*/
		users.forEach(function(users,index){
			if(users == $('.myInfoView').attr("id")) $('#me').val(users);
			else $('#you').val(users);
		});
		var roomTitle = $.grep(users, function( a ) {
      	  return a !== $('.myInfoView').attr("id");
        });
        if(roomTitle.length==1){
        	$('[class="myRoom-title-img"]').css({'background-image':'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[0]+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
        }else if(roomTitle.length==2){
        	$('[class="myRoom-title-img"]').css({'background-image':'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[0]+'/userProfileImg/user_profile_img.png), url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[1]+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
        	$('[class="myRoom-title-img"]').css({'background-position':'left, right,left, right'});
        	$('[class="myRoom-title-img"]').css({'background-size':'50% 100%'});
        }else if(roomTitle.length>=3){
        	$('[class="myRoom-title-img"]').css({'background-image':
        		'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[0]+'/userProfileImg/user_profile_img.png),\
        		url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[1]+'/userProfileImg/user_profile_img.png),\
        		url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+roomTitle[2]+'/userProfileImg/user_profile_img.png),\
        		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png),\
        		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png),\
        		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
        	$('[class="myRoom-title-img"]').css({'background-position':'left top, right top, bottom left,left top, right top, bottom left'});
        	$('[class="myRoom-title-img"]').css({'background-size':'50% 50%'});
        }   
    	socket.emit('roomChange', thisRoom);
    });
	socket.on('rooms', function(rooms, roomName, me) {
        $('#room-list').empty();
        var text;
        var pasttime;
        var time;
        var nowtime;
        var count = 0;
        var backEmail;
        rooms.forEach(function(room, index){
            if (room != '') {
            	room.messagelog.forEach(function(log,index){
            		if(jQuery.inArray(me,log.readby) == -1) count++;
            	});
            	backEmail = $.grep(room.users, function( a ) {
                	  return a !== me;
                });
            	roomName.roomName.forEach(function(name, index){
            		if(name.roomId == room.id){
	                	time = new Date();
	                	var hour =time.getHours();
	                	var min =time.getMinutes();
	                	pasttime = (room.messagelog[room.messagelog.length-1].mdate).substring(11,16);
	                	text = '    <div class="myRoom" id="'+room.id+'"><div class="myRoom-img '+index+'"></div>\
	                				<div class="roomname">'+name.rName+'</div>\
	                				<div class="roomtext">'+room.messagelog[room.messagelog.length-1].message+'</div>	\
	                				<div class="roomtime">'+pasttime+'</div>\
	                				<div class="circle">'+count+'</div></div>';
	                    $('#room-list').append(text);
	                    if(backEmail.length==1){
	                    	$('[class="myRoom-img '+index+'"]').css({'background-image':'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+backEmail[0]+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
	                    }else if(backEmail.length==2){
	                    	$('[class="myRoom-img '+index+'"]').css({'background-image':'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+backEmail[0]+'/userProfileImg/user_profile_img.png), url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+backEmail[1]+'/userProfileImg/user_profile_img.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png), url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
	                    	$('[class="myRoom-img '+index+'"]').css({'background-position':'left, right,left, right'});
	                    	$('[class="myRoom-img '+index+'"]').css({'background-size':'50% 100%'});
	                    }else if(backEmail.length>=3){
	                    	$('[class="myRoom-img '+index+'"]').css({'background-image':
	                    		'url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+backEmail[0]+'/userProfileImg/user_profile_img.png),\
	                    		url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+backEmail[1]+'/userProfileImg/user_profile_img.png),\
	                    		url(https://archa-bucket.s3-ap-northeast-1.amazonaws.com/'+backEmail[2]+'/userProfileImg/user_profile_img.png),\
	                    		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png),\
	                    		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png),\
	                    		url(https://s3-ap-northeast-1.amazonaws.com/archa-bucket/user-profile/background1.png)'});
	                    	$('[class="myRoom-img '+index+'"]').css({'background-position':'left top, right top, bottom left,left top, right top, bottom left'});
	                    	$('[class="myRoom-img '+index+'"]').css({'background-size':'50% 50%'});
	                    }
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
 	
	socket.on('state', function(state){
		if(state){
			$('.state').css('background-color', '#2CCA70');
		}else{
			$('.state').css('background-color', '#c0c0c0');
		}
	});
	socket.on('reState', function(state,id){
		if(state){
			$('[id="'+id+'"]').children('#group-profile').children('#group-state').css('background-color', '#2CCA70');
		}else{
			$('[id="'+id+'"]').children('#group-profile').children('#group-state').css('background-color', '#c0c0c0');
		}
	});
	socket.on('noti', function(history){
		history.forEach(function(index){
			$('#noti-text').append('<div class="notitab"><div id="noti-img"></div><div id="noti-textbox">'+index.name+'\
					</br><div id="connect-you">is connected with you</div></div></div>');
			$('#noti-text').append('<br>');
		})
	});
	
});
