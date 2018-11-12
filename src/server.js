var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var PORT = process.env.PORT || 8000;
var INDEX = path.join(__dirname, 'index.html');
var numUsers = 0;

io.on('connection', function(socket) {
  var addedUser = false;
  console.info(`Client connected [id=${socket.id}]`);

  // when the client emits 'new-message', this listens and executes
  socket.on('new-message', data => {
    // we tell the client to execute 'new-message'
    socket.broadcast.emit('new-message', {
      username: socket.username,
      message: data,
    });
  });

  socket.on('add-user', username => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers,
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user-joined', {
      username: socket.username,
      numUsers: numUsers,
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop-typing', we broadcast it to others
  socket.on('stop-typing', () => {
    socket.broadcast.emit('stop-typing', {
      username: socket.username,
      typing: false
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    console.info(`Client disconected [id=${socket.id}]`);
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user-left', {
        username: socket.username,
        numUsers: numUsers,
      });
    }
  });
});

app.use((req, res) => res.sendFile(INDEX) )
http.listen(PORT, function() {
  console.log(`Server start on *:${PORT}`);
});
