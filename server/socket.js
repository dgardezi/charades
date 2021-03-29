var express = require("express");
var app = express();
var server = app.listen(3001);
const socketio = require("socket.io");
const io = socketio(server);

const router = require("./router");
const cors = require("cors");
app.use(cors());
app.use(router);

app.set("port", process.env.PORT || 3001);

if (process.env.PORT) {
  console.log("server running on port " + process.env.PORT);
} else {
  console.log("server running on port 3001");
}

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
}

// Start Peer server to handle video connections
const { PeerServer } = require("peer");
const peerServer = PeerServer({ port: 443, path: "video" });

module.exports = { io };
