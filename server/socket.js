var express = require("express");
var app = express();
var server = app.listen(3001);
const socketio = require("socket.io");
const io = socketio(server);

const router = require("./router");
const cors = require("cors");
app.use(cors());
app.use(router);

module.exports = { io };
