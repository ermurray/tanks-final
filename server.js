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



const io = require('socket.io')(http, {
  cors: {
  origin: ORIGIN,
  methods: ["GET", "POST"],
  }
});


// compression middleware
app.use(compression());

// static file-serving middleware
app.use(express.static(path.join(__dirname,"public")));

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
// const players = {};
//player spwan points 4 corners

const spawnPoints = [
  [64, 64, "pOne"],
  [1136, 64, "pTwo"],
  [64, 536, "pThree"],
  [1136, 536, "pFour"]
];

const gameRooms = {
  // [roomKey]: {
      // players: {},  //will hold each player object
      // numPlayers: 0,
      // chatMessages: []  //will hold room chat messages
      //roomfull: false  //use to check room is full

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

io.on("connection", (socket) => {

  console.log(
    `A socket connection to the server has been made: ${socket.id}`
  );

// on join room function begins
  socket.on("joinRoom", (roomKey, playerName) => {
    socket.join(roomKey);
    const roomInfo = gameRooms[roomKey];
    console.log("roomInfo", roomInfo);
    roomInfo.players[socket.id] = {
      // rotation: 0,
      // x: 400,
      // y: 300,
      playerId: socket.id,
      pName: playerName,
      pNumber:'',
      chatMessages:[]  //will hold players sent chat messages
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
// on join room function ends

  // when a player moves, update the player data
  socket.on("playerMovement", function (data) {
  //  console.log('playerMovement data:', data)
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

    console.log('bullet object:', data)
    const { x, y, roomKey } = data;
    // emit a message to all players about the player that shot a bullet
    socket
      .to(roomKey)
      .emit("playerHasShot", newBullet);
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

  socket.on("isKeyValid", function (input, playerName) {
    if(!Object.keys(gameRooms).includes(input)){
      socket.emit("keyNotValid");
    } else if (gameRooms[input].numPlayers >= 4) {
      socket.emit("gameIsFull", input, playerName);
    } else {
      socket.emit("keyIsValid", input, playerName);
      console.log("---->",gameRooms[input].numPlayers)
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
    console.log('before game room update:',gameRooms[roomKey]);
    const selectedPNumber = players[socketID].pNumber;
    gameRooms[roomKey].players[socketID].pNumber = selectedPNumber;
    console.log('set-pNumber stateobj players:', players[socketID].pNumber)
    console.log('players obj in room', gameRooms[roomKey].players[socketID])
   
    io.in(roomKey).emit('player-selectedTank', socketID, players[socketID], players[socketID].pName)
  });

});

// function ServerGameLoop(){
//   for(var i=0;i<bullet_array.length;i++){
//     let bullet = bullet_array[i];
//     bullet.x += bullet.speed_x; 
//     bullet.y += bullet.speed_y; 
    
//     // Check if this bullet is close enough to hit any player 
//     for(let id in players){
//       if(bullet.owner_id != id){
//         // And your own bullet shouldn't kill you
//         var dx = players[id].x - bullet.x; 
//         var dy = players[id].y - bullet.y;
//         var dist = Math.sqrt(dx * dx + dy * dy);
//         if(dist < 70){
//           io.emit('player-hit',id); // Tell everyone this player got hit
//         }
//       }
//     }
    
//     // Remove if it goes too far off screen 
//     if(bullet.x < -10 || bullet.x > 1000 || bullet.y < -10 || bullet.y > 1000){
//         bullet_array.splice(i,1);
//         i--;
//     }
        
//   }
//   // Tell everyone where all the bullets are by sending the whole array
//   io.emit("bullets-update",bullet_array);
// }
// setInterval(ServerGameLoop, 16); 


http.listen(PORT, function() {
  console.log(`Server started and listening on port: ${PORT}`)
});
