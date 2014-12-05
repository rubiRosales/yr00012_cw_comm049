//fetch the node static and http modules
var static = require('node-static');
var http = require('http');

var port = 8080;

var file = new static.Server('./public');

var app = http.createServer(function(request, response){
	file.serve(request, response, function(error,result){
		if(error){
			console.error('There is an error serving '+ request.url+ '-'+ error.message);
			response.writeHead(error.status, error.headers);
			response.end();
		}else{
			console.log(request.url + '-' + result.message);
		}
	});
}).listen(port);

console.log('node-static running at http://localhost:', port)

//real-time communication
var io = require('socket.io').listen(app);


//manage the connection
io.sockets.on('connection', function (socket){

	//handle messages
	socket.on('message', function (message){
		console.log('got message: ' + message.message + 'for room' + message.room);
		socket.broadcast.in(message.room).emit('message', message);
	});

	// handle the creation of messages
	socket.on('join', function (login) {
		var roomMembers = [];

		for (var clientId in io.sockets.adapter.rooms[login.room]){
			roomMembers.push(clientId);
		}
		var numClients = roomMembers.length;
		console.log('Room ' + login.room + ' has ' + numClients + ' client(s)');
		console.log('Request to join ' + login.room );

		if (numClients === 0){
			console.log("1 in");
			socket.join(login.room);
			socket.emit('created', login);
		} else if (numClients === 1) {
			console.log("second in");
			io.sockets.in(login.room).emit('joining', login);
			socket.join(login.room);
            socket.emit('joined chat', login);
		} else { // max two clients
			console.log("full");
			socket.emit('full', null);
		}
	});

	socket.on('notify', function (userDetails){
		socket.broadcast.to(userDetails.room).emit('notify', userDetails);
		console.log('notifying of member joining', userDetails);
	});
});
	
