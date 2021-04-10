const server =  require('express')();
const cors = require('cors');
const http = require('http').createServer(server);
server.use(cors());

const io = require('socket.io')(http, {
  cors: {
  origin: "http://localhost:8081",
  methods: ["GET", "POST"],
  }
});
const port = 3000

const players = {};

io.on('connection', function(socket) {
  console.log(`A user has connected: ${socket.id}`);

// create and add new player with id matching socket.id
  players[socket.id] = {
    rotation: 0,
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  };
// send the players object to the new player
socket.emit('currentPlayers', players);
// update all other players of the new player
socket.broadcast.emit('newPlayer', players[socket.id]);
  
  
  socket.on('disconnect', function() {
    console.log(`A user has disconnected: ${socket.id}`)
    delete players[socket.id];
    io.emit('disconnect', socket.id);
  });

});


http.listen(port, function() {
  console.log(`Server started and listening on port: ${port}`)
});
