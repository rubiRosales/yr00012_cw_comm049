$(function(){

	$('.chat-messages').hide();
	$('.message-input').hide();
	$('.members').hide();
	$('#updates').hide();
	$('#svgStar').hide();
	

	$('#joinChat').click(function(){

		$('#login').hide();
		$('.chat-messages').show();
		$('.message-input').show();
		$('.members').show();
		$('#updates').show();
	})
	
	
});
