const server =  require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);
const port = 3000



io.on('conneciton', function(socket) {
  console.log(`A user has connected: ${socket.id}`);
  
  socket.on('disconnect', function() {
    console.log(`A user has disconnected: ${socket.id}`)
  });

});


http.listen(port, function() {
  console.log(`Server started and listening on port: ${port}`)
});