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
			$.get('/add_username', {usernames: $('#usernames').val() + ', ' + $(this).parent().attr("id"), chatid: $('#chatid').val() }, function(resp){
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
	            			$('#display').append("<p> "+ resp.sender + ": " + resp.message + "<br/>" + resp.timestamp + "</p>");
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
	
	
	
	var chat_count = '0';
	(function poll2() {
	    setTimeout(function() {
	        $.ajax({
	            url: "/poll_chat",
	            type: "GET",
	            //data: { chatid: $('#chatid').val(), msg_count: count},
	            success: function(data) {	            	
	            	if(chat_count == data) {
	            		
	            	} else {	
	            		
	            		$('#notification').html("");
	            		$.get('/push_notify', function(resp){

	            			$.each(resp, function(key, val) {
	            				//alert(val.fields.receivers);
	            				$('#notification').append("<p id='"+ val.fields.chatid +"' class='chatbox'>" + val.fields.receivers + "</p>");
	            			});	            			
	            		});
	            		chat_count = data;
	            	}
	            },
	            dataType: "json",
	            complete: poll2,
	            timeout: 2000
	        })
	    }, 500);
	})();
	
	$('#notification').on('click','p.chatbox' ,function() {
		$('#empty').remove();
		$('#display').html("");
		$('#receivers').text("");
		$('#usernames').val("");
		chat = "opened";
		$('.chat').fadeOut("fast", "linear");
		$('.chat').fadeIn("fast", "linear");
		
		alert($(this).attr('id'));
		$('#chatid').val($(this).attr('id'));
		$('#receivers').text($(this).text());
		$('#usernames').val($(this).text()); 
		
	});
	
});