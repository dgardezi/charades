var express = require("express");
var app = express();
var server = app.listen(3001);
const socketio = require("socket.io");
const io = socketio(server);

const router = require("./router");
const cors = require("cors");
app.use(cors());
app.use(router);

// Start Peer server to handle video connections
const { PeerServer } = require("peer");
const peerServer = PeerServer({ port: 9000, path: "video" });

module.exports = { io };
