const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')))
let PORT = process.env.PORT||3000;
server.listen(PORT, () => {
  console.log('listening on *:3000');
});