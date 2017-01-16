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
                                <div id="me_image" class="message_sender"></div>\
                                <div class="talk me" id="'+msg.email+'">\
                                	<div id="talkname">'+msg.name+'</div></br><span class="message_body"></span>\
                                </div>\
                                <div class="message_date" id="'+msg.mdate+'"></div>\
                          </div></br>';
        return text;
	}
    function nearMe(msg){
        var text= '<div class="message_box_send">\
                                <div class="talk me" id="'+msg.email+'"><span class="message_body"></span></div>\
                                <div class="message_date" id="'+msg.mdate+'"></div>\
                          </div></br>';
        return text;
	}	
	function other(msg){
		return '<div class="message_box_re">\
					<div id="other_image" class="message_re"></div>\
					<div class="talk other" id="'+msg.email+'"><div id="talkother">'+msg.name+'</div><br><span class="message_body"></span></div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}
	function nearOther(msg){
		return '<div class="message_box_re">\
					<div class="talk other" id="'+msg.email+'"><span class="message_body"></span></div>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}	
	function myYoutube(msg,meta){
		return '<div class="message_box_send">\
					<a id="'+msg.name+'" class="message_sender">'+msg.name+'</a>\
					<p class="talk me" id="'+msg.email+'"><span class="message_body"></span></p>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>\
				<iframe class="talk me url"\
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></br>';
	}
	function nearMyYoutube(msg,meta){
		return '<div class="message_box_send">\
					<p class="talk me" id="'+msg.email+'"><span class="message_body"></span></p>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>\
				<iframe class="talk me url"\
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></br>';
	}
	function otherYoutube(msg,meta){
		return '<div class="message_box_re">\
					<a id='+msg.name+' class="message_re">'+msg.name+'</a>\
					<p class="talk other" id="'+msg.email+'"><span class="message_body"></span></p>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>\
				<iframe class="talk other url"\
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></br>';
	}
	function nearOtherYoutube(msg,meta){
		return '<div class="message_box_re">\
					<p class="talk other" id="'+msg.email+'"><span class="message_body"></span></p>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>\
				<iframe class="talk other url"\
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></br>';
	}	
	function myUrl(msg,meta){
		var text =  '<div class="message_box_send">\
						<a id='+msg.name+' class="message_sender">'+msg.name+'</a>\
						<p class="talk me" id="'+msg.email+'"><span class="message_body"></span></p>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					<br/>\
					<div class="talk me url" id="'+msg.email+'">\
						<a  href="'+meta.data.ogUrl+'" target="_blank">\
							<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
							<span style="float:right;" >'+meta.data.ogDescription+'</span>\
						</a>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					</div></div><br/>';
		return text;
		
	}
	function nearMyUrl(msg,meta){
		var text =  '<div class="message_box_send">\
						<p class="talk me" id="'+msg.email+'"><span class="message_body"></span></p>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					<br/>\
					<div class="talk me url" id="'+msg.email+'">\
						<a  href="'+meta.data.ogUrl+'" target="_blank">\
							<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
							<span style="float:right;" >'+meta.data.ogDescription+'</span>\
						</a>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					</div></div><br/>';
		return text;
		
	}
	function otherUrl(msg,meta){
		return '<div class="message_box_re">\
					<a id='+msg.name+' class="message_re">'+msg.name+'</a>\
					<p class="talk other" id="'+msg.email+'"><span class="message_body"></span></p>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div>\
				<div class="talk other url" id="'+msg.email+'"> \
					<a href="'+meta.data.ogUrl+'" target="_blank">\
						<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
						<span style="float:left;" >'+meta.data.ogDescription+'</span>\
					</a>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}
	function nearOtherUrl(msg,meta){
		return '<div class="message_box_re">\
					<p class="talk other" id="'+msg.email+'"><span class="message_body"></span></p>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div>\
				<div class="talk other url" id="'+msg.email+'"> \
					<a href="'+meta.data.ogUrl+'" target="_blank">\
						<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
						<span style="float:left;" >'+meta.data.ogDescription+'</span>\
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
				 <div id="me_image" class="message_sender"></div>\
				 <div class="myfileimage talk me" id="'+send_userEmail+'"><div id="imagename">'+send_userName+'</div></br>\
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
					 <div class="myfileimage talk me" id="'+send_userEmail+'"><div id="imagename"></div></br>\
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
		return '<div class="file_box_re reData">\
					<div id="other_image" class="message_re"></div>\
					<div class="otherfileimage talk other" id="'+re_userEmail+'"><div id="otherimagename">'+re_userName+'</div></br>\
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
		return '<div class="file_box_re reData">\
				<div class="otherfileimage talk other" id="'+re_userEmail+'"></br>\
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
	function myImage(data,send_userEmail,send_userName){
		return '<div class="message_box_send sendData">\
				 <div id="me_image" class="message_sender"></div>\
				 <div class="myimage talk me" id="'+send_userEmail+'"><div id="imagename">'+send_userName+'</div></br>\
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
					 <div class="myimage talk me" id="'+send_userEmail+'"></br>\
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
					<div id="other_image" class="message_re"></div>\
			 		<div class="otherimage talk other" id="'+re_userEmail+'"><div id="otherimagename">'+re_userName+'</div></br>\
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
			 		<div class="otherimage talk other" id="'+re_userEmail+'"></br>\
						<a data-src="'+data.url+'" href="'+data.url+'" target="'+data.url+'" style="width: 50%;" class="image_file_body" data-link-url="'+data.url+'">\
							<div class="image_preserve_aspect_ratio">\
								<img class="image_body" data-real-src="'+data.url+'" src="'+data.url+'"\>\
							</div>\
						</a>\
					</div>\
					<div class="message_date" id="'+data.date+'"></div>\
				</div></br>';
	}	
	socket = io.connect();
	socket.emit('myId', $('.myInfoView').attr("id"));
	
	socket.on('my message', function (msg) {
    	if($('#messages').children('div').index() > -1){
    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
    		var nowDate = new Date(msg.mdate);
    		var cal = new Date(nowDate-preDate);
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
		var me = $("#userId").val();
		if(me == msg.name){
	    	if($('#messages').children('div').index() > -1){
	    		var preDate = new Date($('#messages').children('div').last().children('.message_date').attr('id'));
	    		var nowDate = new Date(msg.mdate);
	    		var cal = new Date(nowDate-preDate);
	    		if($('#messages').children('div').last().children('.talk').attr('id') == msg.email && cal.getDate()==1 && cal.getHours()==9 && cal.getMinutes() <= 5){
	    			$('#messages').append(nearMyYouTube(msg,meta));
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
		room.messagelog.forEach(function(val, i){
			if(i!=0){
				var testDate = new Date(val.mdate);
				var tempDate = new Date(temp.mdate);
				var cal = new Date(testDate-tempDate);
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

	socket.on('ogData', function(meta,url, sendEmail, me,i,val){
		if(sendEmail == me){
			$('#messages').children('[id="'+i+'"]').append(myUrlMeta(meta,me,val));
		}else{
			$('#messages').children('[id="'+i+'"]').append(otherUrlMeta(meta,me,val));
		}
	});
	socket.on('youOgData', function(meta, url, sendEmail, me, i,val){
		if(sendEmail == me){
			$('#messages').children('[id="'+i+'"]').append(myYoutubeMeta(meta,me,val));
		}else{
			$('#messages').children('[id="'+i+'"]').append(otherYoutubeMeta(meta,me,val));
		}	
	});
	function myUrlHead(msg,i){
		var text =  '<div class="message_box_send" id='+i+'>\
						<a id='+msg.name+' class="message_sender">'+msg.name+'</a>\
						<p class="talk me" id="'+msg.email+'">'+msg.message+'</p>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					</div><br/>';
		return text;
	}
	function nearMyUrlHead(msg,i){
		var text =  '<div class="message_box_send" id='+i+'>\
						<p class="talk me" id="'+msg.email+'">'+msg.message+'</p>\
						<div class="message_date" id="'+msg.mdate+'"></div>\
					</div><br/>';
		return text;
	}
	function myUrlMeta(meta,me,val){
		var text =  '<div class="talk me url" id="'+me+'">\
						<a  href="'+(meta.data.ogUrl == undefined ? val.url : meta.data.ogUrl)+'" target="_blank">\
							<img class="imgUrl" src="'+(meta.data.ogImage.url == undefined ? 'https://www.google.com/s2/favicons?domain='+val.url:meta.data.ogImage.url)+'"/>\
							<span style="float:right;" >'+(meta.data.ogDescription == undefined && meta.data.ogTitle != undefined ? meta.data.ogTitle : meta.data.ogDescription )+'</span>\
						</a>\
						<div class="message_date" id="'+val.mdate+'"></div>\
					</div></br>';			

		return text;
	}
	
	function otherUrlHead(msg,i){
		return '<div class="message_box_re" id='+i+'>\
					<a id='+msg.name+' class="message_re">'+msg.name+'</a>\
					<p class="talk other" id="'+msg.email+'">'+msg.message+'</p>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}
	function nearOtherUrlHead(msg,i){
		return '<div class="message_box_re" id='+i+'>\
					<p class="talk other" id="'+msg.email+'">'+msg.message+'</p>\
					<div class="message_date" id="'+msg.mdate+'"></div>\
				</div></br>';
	}
	function otherUrlMeta(meta,me,val){
		return '<div class="talk other url" id="'+me+'"> \
					<a href="'+meta.data.ogUrl+'" target="_blank">\
						<img class="imgUrl" src="'+meta.data.ogImage.url+'"/>\
						<span style="float:left;" >'+meta.data.ogDescription+'</span>\
					</a>\
					<div class="message_date" id="'+val.mdate+'"></div>\
				</div></br>';
	}
	function myYoutubeMeta(meta,me){
		return '<iframe class="talk me url" \
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></br>';
	}
	function otherYoutubeMeta(meta,me){
		return '<iframe class="talk other url" \
					src="'+meta.data.ogVideo.url+'"\
					frameborder="0" allowfullscreen>\
				</iframe></br>';
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
