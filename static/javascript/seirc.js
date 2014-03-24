$(document).ready(function() {
	
	
	var chat = "closed";
	
	//single chat
	$('.new').on('click', function() {
		$('#empty').remove();
		$('#display').html("");
		$('#receivers').text("");
		$('#usernames').val("");
		chat = "opened";
		$('.chat').fadeOut("fast", "linear");
		$('.chat').fadeIn("fast", "linear");
		
		$.get('/create_chat',{ usernames: $(this).parent().attr("id") } , function(response){
			$('#receivers').text(response.receivers);
			$('#chatid').val(response.chatid);
			$('#usernames').val(response.receivers); 
		});
	
	});
	
	//add members to chat
	$('.add').click(function() {
		if(chat == "opened") {
			$('#receivers').fadeOut("fast", "linear");
			$.get('/add_username', {added: $(this).parent().attr("id"), usernames: $('#usernames').val() + ', ' + $(this).parent().attr("id"), chatid: $('#chatid').val() }, function(resp){
				$('#receivers').text(resp.receivers);
				$('#usernames').val(resp.receivers); 
			});
			$('#receivers').fadeIn("fast", "linear");
		}
		else 
		{
			
			$('#empty').remove();
			$('#display').html("");
			$('#receivers').text("");
			$('#usernames').val("");
			chat = "opened";
			$('.chat').fadeOut("fast", "linear");
			$('.chat').fadeIn("fast", "linear");
			
			$.get('/create_chat',{ usernames: $(this).parent().attr("id") } , function(response){
				$('#receivers').text(response.receivers);
				$('#chatid').val(response.chatid);
				$('#usernames').val(response.receivers); 
			});
		}
		
	});
	
	$('#send').click(function() {
		$.get('/message',{ message: $('#message').val(), usernames: $('#usernames').val(), chatid: $('#chatid').val()}, function(resp) {
			/*$('#display').append("<label>"+ resp.sender + "</label> : <label>" + resp.message + "</label>" +
								 "<br/><label style='font-size:10px;'>" + resp.timestamp + "</label>");*/
		});
		$('#message').val("");
	});
	
	$('#message').keydown(function (e){
	    if(e.keyCode == 13){
	    	$.get('/message',{ message: $('#message').val(), usernames: $('#usernames').val(), chatid: $('#chatid').val()}, function(resp) {
				/*$('#display').append("<p><label>"+ resp.sender + "</label> : <label>" + resp.message + "</label>" +
									 "<br/><label style='font-size:10px;'>" + resp.timestamp + "</label></p>");*/
			});
			$(this).val("");
	    }
	});
	
	$('#message').click(function (e){
		$(this).val("");
	});
	
	var msg_count = '1';
	(function poll() {
	    setTimeout(function() {
	        $.ajax({
	            url: "/poll_message",
	            type: "GET",
	            data: { chatid: $('#chatid').val(), msg_count: msg_count},
	            success: function(data) {
	            	if(msg_count == data) {
	            		
	            	} else {
	            		$.get('/push_message', {chatid:$('#chatid').val()}, function(resp){
	            			$('#display').append("<p style='margin: 0.8em 0 0.5em 0;color: #333;font-weight: normal;font-family: 'Orienta', sans-serif;font-size: 20px;line-height: 40px;counter-increment: section-2;counter-reset: section-3 section-4;border-bottom: 1px solid #fff;box-shadow: 0 1px 0 rgba(0,0,0,0.1);padding-bottom: 10px;> "+ resp.sender + " says :<br/> " + resp.message + "<br/><label style='font-family: times, serif; font-size:10pt; font-style:italic;'> Sent on " + resp.timestamp + "</label></p>");
	            			$("#display").scrollTop($("#display")[0].scrollHeight);
	            			msg_count = data;
	            		});	            		
	            	}	                
	            },
	            dataType: "json",
	            complete: poll,
	            timeout: 2000
	        })
	    }, 500);
	})();
	
	
	
	//var chat_count=0;
	(function poll2() {
	    setTimeout(function() {
	        $.ajax({
	            url: "/poll_chat",
	            type: "GET",
	            //data: { chatid: $('#chatid').val(), msg_count: count},
	            success: function(data) {	            	
	            	
	            	$.get('/poll_receivers',{chatid: $('#chatid').val()} ,function(resp){
	            		$('#usernames').val(resp);
	            		$('#receivers').text(resp);
            		});
	            		
	            	$('#notification').html("");
            		$.get('/push_notify', function(resp){
            			$('#notification').html("");
            			//$('#usernames').val("")
            			//$('#receivers').text("");
            			$.each(resp, function(key, val) { 				
            				$('#notification').append("<p style='border: dotted 1px #885777; padding: 1em; background-color: #FFF0F5; font-size: .9em; font-style: italic; color: #885777;' id='"+ val.fields.chatid +"' class='chatbox'>" + val.fields.receivers + "</p><hr/>");
            				//$('#usernames').val(val.fields.receivers);
            				//$('#receivers').text(val.fields.receivers);
            			});	            			
            		});	
	            			
	            },
	            dataType: "json",
	            complete: poll2,
	            timeout: 2000
	        })
	    }, 3000);
	})();
	
	$('#notification').on('click','p.chatbox' ,function() {
		$('#empty').remove();
		$('#display').html("");
		$('#receivers').text("");
		$('#usernames').val("");
		$('#chatid').val("");
		chat = "opened";
		$('.chat').fadeOut("fast", "linear");
		$('.chat').fadeIn("fast", "linear");
		
		$('#chatid').val($(this).attr('id'));
		$('#receivers').text($(this).text());
		$('#usernames').val($(this).text()); 
		
	});
	
	
	
});