$(document).ready(function() {

	var chat = "closed";
	//single chat
	$('.new').on('click', function() {
		$('#empty').remove();
		chat = "opened";
		$('.chat').fadeOut("fast", "linear");
		$('.chat').fadeIn("fast", "linear");
		
		$.get('/create_chat',{ usernames: $('#usernames').val() + ', ' + $(this).parent().attr("id") } , function(response){
			$('#receivers').text(response.receivers);
			$('#chatid').val(response.chatid);
			$('#usernames').val(response.receivers); 
		});
	
	});
	
	//add members to chat
	$('.add').click(function() {
		if(chat == "opened") {
			$('#receivers').fadeOut("fast", "linear");
			$.get('/add_username', {usernames: $('#usernames').val() + ', ' + $(this).parent().attr("id"), chatid: $('#chatid').val() }, function(response){
				$('#receivers').text(response);
				$('#usernames').val(response); 
			});
			$('#receivers').fadeIn("fast", "linear");
		}
		else 
		{
			$('#empty').remove();
			chat = "opened";
			$('.chat').fadeOut("fast", "linear");
			$('.chat').fadeIn("fast", "linear");
			
			$.get('/create_chat',{ usernames: $('#usernames').val() + ', ' + $(this).parent().attr("id") } , function(response){
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
		$(this).val("");
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
	
	(function poll() {
	    setTimeout(function() {
	        $.ajax({
	            url: "/push_message",
	            type: "GET",
	            data: { chatid: $('#chatid').val()},
	            success: function(data) {
	                
	            },
	            dataType: "json",
	            complete: poll,
	            timeout: 2000
	        })
	    }, 1000);
	})();
	
});