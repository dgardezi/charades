var express = require("express");
var app = express();
var server = app.listen(3001);
const socketio = require("socket.io");
const cors = require("cors");
const { videoToken } = require("./tokens");
const config = require("./config");

const {
  addUserToRoom,
  createRoom,
  removeUserFromRoom,
  getUsersFromRoom,
  getUser,
  closeRoom,
} = require("./rooms");

const router = require("./router");

const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connect", (socket) => {
  console.log("user connected");

  socket.on("joinRoomQuery", ({ name, room }) => {
    const response = addUserToRoom(socket.id, name, room);

    const token = videoToken(name, room, config);

    socket.emit("joinRoomResponse", { response, token: token.toJwt() });
  });

  socket.on("createRoomQuery", ({ name }) => {
    console.log(`${name} tried to make a new room`);

    const room = createRoom();
    const response = addUserToRoom(socket.id, name, room);

    const token = videoToken(name, room, config);

    socket.emit("createRoomResponse", {
      response,
      room: room,
      token: token.toJwt(),
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const user = getUser(socket.id);
  });
});

console.log("server running on port 3001");

// console.log(createRoom("hey").message + " expected: Success");
// console.log(createRoom("hey").message + " expected: Room Already Exists");
// console.log(createRoom("hello").message + " expected: Success");

// console.log(addUserToRoom(1, "Duncan", "hey").message + " expected: Success");
// console.log(addUserToRoom(2, "Griffin", "hey").message + " expected: Success");
// console.log(
//   addUserToRoom(3, "Duncan", "hey").message + " expected: Username taken"
// );
// console.log(addUserToRoom(3, "Duncan", "hello").message + " expected: Success");

// console.log(
//   removeUserFromRoom(2, "hello").message +
//     " expected: User does not exist in room"
// );
// console.log(removeUserFromRoom(3, "hello").message + " expected: Success");
// console.log(
//   removeUserFromRoom(2, "abc").message + " expected: Room does not exist"
// );

// console.log(
//   getUsersFromRoom("hello").map(
//     (user) => `{${user.userId}, ${user.userName}}`
//   ) + " expected: []"
// );
// console.log(
//   getUsersFromRoom("hey").map((user) => `{${user.userId}, ${user.userName}}`) +
//     " expected: [{1, Duncan}, {2, Griffin}]"
// );

// console.log(getUser(1) + " expected: {duncan, hey}");
// console.log(getUser(2) + " expected: {griffin, hey}");
// console.log(getUser(3) + " expected: null");

// console.log(closeRoom("hey").message + " expected: sucess");
// console.log(closeRoom("abc").message + " expected: room does not exist");
// console.log(getUser(1) + " expected: null");
