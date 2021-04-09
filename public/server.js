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



io.on('connection', function(socket) {
  console.log(`A user has connected: ${socket.id}`);
  
  socket.on('disconnect', function() {
    console.log(`A user has disconnected: ${socket.id}`)
  });

});


http.listen(port, function() {
  console.log(`Server started and listening on port: ${port}`)
});