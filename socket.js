var express = require("express");
var app = express();

const port = process.env.PORT || 3001;

var server = app.listen(port);
const socketio = require("socket.io");
const io = socketio(server);

const cors = require("cors");
app.use(cors());

app.set("port", port);
console.log("server running on port " + port);

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));
}

// Start Peer server to handle video connections
const { PeerServer } = require("peer");
const peerServer = PeerServer({
  port: process.env.PORT || 443,
  path: "video",
});

module.exports = { io };
