const server =  require('express')();
const cors = require('cors');
const http = require('http').createServer(server);
server.use(cors());

const io = require('socket.io')(http, {
  cors: {
  origin: "http://localhost:8080",
  methods: ["GET", "POST"],
  }
});
const port = 3000

const players = {};
//player spwan points top 4 corners

const spawnPoints = [
  [64, 64, "pOne"],
  [1136, 64, "pTwo"],
  [64, 536, "pThree"],
  [1136, 536, "pFour"]
];


io.on('createRoom', (roomName, callback) => {
  const room = {
    id: uuid(),
    name: roomName,
    sockets: []
  };
  rooms[room.id] = room;
  joinRoom(socket, room);
  callback();
})

io.on('getRoomNames', (data, callback) => {
  const roomNames = [];
  for (const id in rooms) {
    const {name} = rooms[id];
    const room = {name, id};
    roomNames.push(room)
  }
  callback(roomNames)
})

const joinRoom = (socket, room) => {
  room.sockets.push(socket)
  socket.join(room.id, ()=>{
    socket.roomId = room.id;
    console.log(socket.id, "Joined", room.id)
  });
};

io.on('ready', ()=>{
  console.log(socket.id, "is ready");
  const room = rooms[socket.roomId];

  if (room.sockets.length == 4){
    for (const client of room.sockets){
      client.emit('startGame')
    }
  }
})

io.on('connection', function(socket) {
  console.log(`A user has connected: ${socket.id}`);

// create and add new player with id matching socket.id
  players[socket.id] = {
    rotation: 0,
    x: spawnPoints[0][0],
    y: spawnPoints[0][1],
    playerId: socket.id,
    // team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  };
// send the players object to the new player
socket.emit('currentPlayers', players);
// update all other players of the new player
socket.broadcast.emit('newPlayer', players[socket.id]);
  
  
  socket.on('disconnect', function() {
    console.log(`A user has disconnected: ${socket.id}`)
    delete players[socket.id];
    io.emit('remove', socket.id);
  });

  // when a player moves, update the player data
// socket.on('playerMovement', function (movementData) {
//   players[socket.id].x = movementData.x;
//   players[socket.id].y = movementData.y;
//   players[socket.id].rotation = movementData.rotation;
//   // emit a message to all players about the player that moved
//   socket.broadcast.emit('playerMoved', players[socket.id]);
// });

});


http.listen(port, function() {
  console.log(`Server started and listening on port: ${port}`)
});
