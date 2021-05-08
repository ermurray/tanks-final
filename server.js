require('dotenv').config();
const express = require('express');
const app   = express();
const path = require('path');
const compression = require("compression");
const cors   = require('cors');
const http   = require('http').createServer(app);
const morgan = require('morgan');
const ORIGIN = process.env.ORIGIN || "http://localhost:8080"
const PORT = process.env.PORT || 3000
app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

const io = require('socket.io')(http, {
  cors: {
  origin: ORIGIN,
  methods: ["GET", "POST"],
  }
});


// compression middleware
app.use(compression());

// static file-serving middleware
app.use(express.static(path.join(__dirname,"/public")));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

// sends index.html
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname,  "/index.html"));
});


const MAX_PLAYERS = 4;


const gameRooms = {
  // [roomKey]: {
      // players: {},  //will hold each player object
      // numPlayers: 0,
      // chatMessages: []  //will hold room chat messages
      //roomFull: false  //use to check room is full
      //gameStarted: false
  // }
};

let bulletArray = []



function codeGenerator() {
  let code = "";
  let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
//==============================begining of socket connection=======================
io.on("connection", (socket) => {

  console.log(
    `A socket connection to the server has been made: ${socket.id}`
  );

// on join room function begins
  socket.on("joinRoom", (roomKey, playerName) => {
    let isFull = gameRooms[roomKey].roomFull;
    let isStarted = gameRooms[roomKey].gameStarted;
    if(!isFull && !isStarted){
      socket.join(roomKey);
      const roomInfo = gameRooms[roomKey];
      roomInfo.players[socket.id] = {
        playerId: socket.id,
        pName: playerName,
        pNumber:'',
        isReady: false,
        chatMessages:[]  //will hold players sent chat messages
      };
      socket.emit('joining')
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
      if(roomInfo.numPlayers > MAX_PLAYERS){
          gameRooms[roomkey].roomFull = true;
      }
    }
    if(isFull||isStarted){
      socket.emit('roomFull')
    } 
  });
// on join room function ends

  // when a player moves, update the player data
  socket.on("playerMovement", function (data) {
  
    const { direction,vector2, x, y, roomKey } = data;
    gameRooms[roomKey].players[socket.id].x = x;
    gameRooms[roomKey].players[socket.id].y = y;
    gameRooms[roomKey].players[socket.id].vector2 = vector2;
    gameRooms[roomKey].players[socket.id].direction = direction;
    // emit a message to all players about the player that moved
    socket
      .to(roomKey)
      .emit("playerMoved", gameRooms[roomKey].players[socket.id]);
  }); 

  // when a player shoots, update the player data
  socket.on("playerShoot", function (data) {
    let newBullet = data;
    data.owner_id = socket.id; // Attach id of the player to the bullet 
    bulletArray.push(newBullet);

    //console.log('bullet object:', data)
    const { x, y, roomKey } = data;
    // emit a message to all players about the player that shot a bullet
    socket
      .to(roomKey)
      .emit("playerHasShot", newBullet);
  });

  socket.on('playerHit', (data) => {
    //console.log("------------------PLAYER HIT -----------");
    //console.log(data)
    socket
      .in(data.roomKey)
      .emit("playerHasBeenHit", data.socket);
  })

  socket.on('playerDeath', (data) => {
    //console.log("PLAYER DEATH",data.id)
    socket
      .in(data.roomKey)
      .emit('playerHasDied', data)
  })



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

  socket.on("isKeyValid", function (input, playerName) {
    if(!Object.keys(gameRooms).includes(input)){
      socket.emit("keyNotValid");
    }  else {
      socket.emit("keyIsValid", input, playerName);
     
    }

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
      numReadyPlayers: 0,
      roomFull: false,
      gameStarted: false
    };
    console.log("Room created", key);
    socket.emit("roomCreated", key);
  });

  socket.on("chatMessage", (data)=>{
    const {roomKey, message, pName} = data;
    const newMessage = `${pName}: ${message}`
    // gameRooms[roomKey].chatMessages.push(newMessage)
    // if(gameRooms[roomKey].chatMessages.length > 20) {
    //   gameRooms[roomKey].chatMessages.length.shift();
    // }
    console.log('chatlogserver:\n',newMessage);
    console.log(gameRooms)
    io.in(roomKey).emit("message", pName, message )
  })

  socket.on('set-pNumber', (socketID, stateObj)=>{
    const { roomKey, players} = stateObj;
    
    const selectedPNumber = players[socketID].pNumber;
    gameRooms[roomKey].players[socketID].pNumber = selectedPNumber;
    
   
    io.in(roomKey).emit('player-selectedTank', socketID, players[socketID], players[socketID].pName)
  });
  socket.on('playerReady', (data, readyPlayer) => {
    const { roomKey, players} = data
    gameRooms[roomKey].numReadyPlayers +=1;
    
    io.in(roomKey).emit('playerIsReady',readyPlayer);
    if (gameRooms[roomKey].numReadyPlayers === gameRooms[roomKey].numPlayers) {
      io.in(roomKey).emit('transToGame', data);
    }
    
  });
  
  socket.on('in-game',(data)=>{
    console.log('player', socket.id)

  })

});
//=========================end of socket connection=======================
////=======================================================================


http.listen(PORT, function() {
  console.log(`Server started and listening on port: ${PORT}`)
});
