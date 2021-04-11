const app = require('express')();
const cors   = require('cors');
const http   = require('http').createServer(app);
const morgan = require('morgan');
app.use(cors());

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
// const path = require("path");
// var express = require("express");
// var app = express();
// var app = require("http").Server(app);
// const socketio = require("socket.io");
// const io = socketio(app);

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
  socket.emit("currentPlayers", players);
  // send the spawnPoints object to the new player
  socket.emit("spawnPoints", spawnPoints);
  // update all other players of the new player
  socket.broadcast.emit("newPlayer", players[socket.id]);
  // when a player disconnects, remove them from our players object
  socket.on("disconnect", function () {
    console.log("user disconnected");
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit("disconnected", socket.id);
  });
  // when a player moves, update the player data
  socket.on("playerMovement", function (movementData) {
    // console.log("inside playermovement, socket object ---> ", socket);
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    // emit a message to all players about the player that moved
    socket.broadcast.emit("playerMoved", players[socket.id]);
  });

});


http.listen(port, function() {
  console.log(`Server started and listening on port: ${port}`)
});
