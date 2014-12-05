$(function() {
  //get messages from dom
  messages = $('#messages');

  console.log("starting chat");

  var socket = io.connect('http://localhost:8080');

  // Let the user create a room and add its username
  $('#joinChat').click(function(){

    room = $('#room').val();
    nickname = $('#nickname').val();

     if(room !== ""){
      console.log('trying to join room: ', room);

       socket.emit('join', {
          room: room,
          nickname: nickname
       });
     } 
     return false;
  });

  //create a room to chat on.
  socket.on('created', function (login){
	console.log('room ' + login.room + ' has been created');
	console.log(login.nickname + 'is the first in');
  $("<span class='notification'>" + login.room + " has been created</span></br>").appendTo("#updates");
  $("<li>" + login.nickname + "</li>").appendTo("#members");
  
  if(localStorage.length > 0){
    for(i=0; i < localStorage.length; i++){
      var key = localStorage.key(i);
      if(key.indexOf('chatLog'+ login.room) > -1){
        var value = localStorage.getItem(key);
        var valArray = value.split("|sep|");
        var nickname = valArray[0];
        var message = valArray[1];
        $("<li>").appendTo("#messages"); 
        $('#svgStar').clone().show().appendTo("#messages");
        $(" <span class='receivedNick'>"+ nickname + "</span> <span class='receivedM'>"+ message + "</span></li>").appendTo("#messages");

      }
    }
    }
   });

   // when the second member joins the room, logs it
  socket.on('joining', function (login) {
    console.log(login.nickname + 'request to join ' + login.room);
    var myDetails = {
      room: room,
      nickname: nickname
    }
    socket.emit('notify', myDetails);
    $("<li>" + login.nickname + "</li>").appendTo("#members");
  });

  socket.on('notify', function (userDetails){
    $("<li>" + userDetails.nickname + "</li>").appendTo("#members");
  });

  // when the person has joined the chat, communicate in the chat
  socket.on('joined chat', function (login) {

    //store messages from within the chat room. 
    if(localStorage.length > 0){
    for(i=0; i < localStorage.length; i++){
      var key = localStorage.key(i);
      if(key.indexOf('chatLog'+ login.room) > -1){
        var value = localStorage.getItem(key);
        var valArray = value.split("|sep|");
        var nickname = valArray[0];
        var message = valArray[1];
        $("<li>").appendTo("#messages"); 
        $('#svgStar').clone().show().appendTo("#messages");
        $(" <span class='receivedNick'>"+ nickname + "</span> <span class='receivedM'>"+ message + "</span></li>").appendTo("#messages");

      }
      
    }
    }

    $("<li>" + login.nickname + "</li>").appendTo("#members");

    $("<span class='notification'>" + login.nickname + " has joined the chat</span></br>").appendTo("#updates");
    console.log(login.nickname);
    
  });

  // send message 
 $("#send_msg").click(function(){
  var message = $("#m").val();
  var received = {
      room: room,
      nickname: nickname,
      message: message
    }

  $("<li>").appendTo("#messages"); 
  $('#svgStar').clone().show().appendTo("#messages");
  $(" <span class='receivedNick'>"+ received.nickname + "</span> <span class='receivedM'>"+ received.message + "</span></li>").appendTo("#messages");

   	
   	socket.emit('message', received);

   	$("#m").val('');


   localStorage.setItem("chatLog" + received.room + localStorage.length, received.nickname+ "|sep|" + received.message );  
   });

  // when the message is sent this is executed
  socket.on('message', function (received) {


   localStorage.setItem("chatLog" + received.room + localStorage.length, received.nickname+ "|sep|" + received.message );  
  $("<li>").appendTo("#messages"); 
  $('#svgStar').clone().show().appendTo("#messages");
  $(" <span class='receivedNick'>"+ received.nickname + "</span> <span class='receivedM'>"+ received.message + "</span></li>").appendTo("#messages");

  });

  //when the chat is full, this is executed.
  socket.on('full', function (login){
  	console.log('full room' + login.room );
    room = null;
    room = prompt("Sorry this room is full time a new name to start chatting");
     if(room !== ""){
      console.log('trying to join room: ', room);

          socket.emit('join', {
          room: room,
          nickname: nickname
          });
     }

  });


  

});