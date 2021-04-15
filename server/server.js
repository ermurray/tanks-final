const app = require('express')();
const cors   = require('cors');
const http   = require('http').createServer(app);
const morgan = require('morgan');
app.use(cors());

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));

const io = require('socket.io')(http, {
  cors: {
  origin: "http://localhost:8080",
  methods: ["GET", "POST"],
  }
});
const port = 3000

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
      // users: [],
      // randomTasks: [],
      // scores: [],
      // gameScore: 0,
      // players: {},  //will hold each player object
      // numPlayers: 0,
      // chatMessages: []  //will hold room chat messages
      //roomfull: false  //use to check room is full

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

  // setInterval(() => {
  //   console.log("gamerooms:",gameRooms)
  // }, 10000);

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
    console.log('movement data:', data)
    const { x, y, roomKey } = data;
    gameRooms[roomKey].players[socket.id].x = x;
    gameRooms[roomKey].players[socket.id].y = y;
    // emit a message to all players about the player that moved
    socket
      .to(roomKey)
      .emit("playerMoved", gameRooms[roomKey].players[socket.id]);
  }); 

  // when a player shoots, update the player data
  socket.on("playerShoot", function (data) {
    console.log('playerShoot:', data)
    const { x, y, roomKey } = data;
    // emit a message to all players about the player that shot a bullet
    socket
      .to(roomKey)
      .emit("playerHasShot", gameRooms[roomKey].players[socket.id]);
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



http.listen(port, function() {
  console.log(`Server started and listening on port: ${port}`)
});
