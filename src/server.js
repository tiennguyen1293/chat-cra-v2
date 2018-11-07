var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(process.env.PORT_SERVER || 8000, function() {
  console.log(`listening on *:${process.env.PORT_SERVER || 8000}`);
});

io.on('connection', function(socket) {
  console.info(`Client connected [id=${socket.id}]`);

  socket.on('new-message', data => {
    console.log(data);
    socket.broadcast.emit('new-message', {
      username: socket.username,
      message: data,
    });
  });

  socket.on('disconnect', () => {
    console.info(`Client disconected [id=${socket.id}]`);
  });
});
