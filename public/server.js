const server =  require('express')();
const cors = require('cors');
const http = require('http').createServer(server);
server.use(cors());

// const path = require("path");
// var express = require("express");
// var app = express();
// var server = require("http").Server(app);
// const socketio = require("socket.io");
// const io = socketio(server);

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

const gameRooms = {
  // [roomKey]: {
  // users: [],
  // randomTasks: [],
  // scores: [],
  // gameScore: 0,
  // players: {},
  // numPlayers: 0
  // }
};

function codeGenerator() {
  let code = "";
  let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

io.on("connection", (socket) => {
  console.log(
    `A socket connection to the server has been made: ${socket.id}`
  );
  socket.on("joinRoom", (roomKey) => {
    socket.join(roomKey);
    const roomInfo = gameRooms[roomKey];
    console.log("roomInfo", roomInfo);
    roomInfo.players[socket.id] = {
      rotation: 0,
      x: 400,
      y: 300,
      playerId: socket.id,
    };

    // update number of players
    roomInfo.numPlayers = Object.keys(roomInfo.players).length;

    // set initial state
    socket.emit("setState", roomInfo);

    // send the players object to the new player
    socket.emit("currentPlayers", {
      players: roomInfo.players,
      numPlayers: roomInfo.numPlayers,
    });

    // update all other players of the new player
    socket.to(roomKey).emit("newPlayer", {
      playerInfo: roomInfo.players[socket.id],
      numPlayers: roomInfo.numPlayers,
    });
  });

  // when a player moves, update the player data
  socket.on("playerMovement", function (data) {
    const { x, y, roomKey } = data;
    gameRooms[roomKey].players[socket.id].x = x;
    gameRooms[roomKey].players[socket.id].y = y;
    // emit a message to all players about the player that moved
    socket
      .to(roomKey)
      .emit("playerMoved", gameRooms[roomKey].players[socket.id]);
  });

  // when a player disconnects, remove them from our players object
  socket.on("disconnect", function () {
    //find which room they belong to
    let roomKey = 0;
    for (let keys1 in gameRooms) {
      for (let keys2 in gameRooms[keys1]) {
        Object.keys(gameRooms[keys1][keys2]).map((el) => {
          if (el === socket.id) {
            roomKey = keys1;
          }
        });
      }
    }

    const roomInfo = gameRooms[roomKey];

    if (roomInfo) {
      console.log("user disconnected: ", socket.id);
      // remove this player from our players object
      delete roomInfo.players[socket.id];
      // update numPlayers
      roomInfo.numPlayers = Object.keys(roomInfo.players).length;
      // emit a message to all players to remove this player
      io.to(roomKey).emit("disconnected", {
        playerId: socket.id,
        numPlayers: roomInfo.numPlayers,
      });
    }
  });

  socket.on("isKeyValid", function (input) {
    Object.keys(gameRooms).includes(input)
      ? socket.emit("keyIsValid", input)
      : socket.emit("keyNotValid");
  });
  // get a random code for the room
  socket.on("getRoomCode", async function () {
    let key = codeGenerator();
    while (Object.keys(gameRooms).includes(key)) {
      key = codeGenerator();
    }
    gameRooms[key] = {
      roomKey: key,
      players: {},
      numPlayers: 0,
    };
    socket.emit("roomCreated", key);
  });
});


http.listen(port, function() {
  console.log(`Server started and listening on port: ${port}`)
});
