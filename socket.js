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

// // Start Peer server to handle video connections
// var ExpressPeerServer = require("peer").ExpressPeerServer;

// var options = {
//   debug: true,
// };

// var server = require("http").createServer(app);
// app.use("/peerjs", ExpressPeerServer(server, options));

module.exports = { io };
