const { videoToken } = require("./tokens");
const config = require("./config");

const { io } = require("./socket");

const {
  addUserToRoom,
  createRoom,
  removeUserFromRoom,
  getUsersFromRoom,
  getUser,
  closeRoom,
} = require("./rooms");

const { createGame } = require("./mechanics");

io.on("connect", (socket) => {
  console.log("user connected");

  socket.on("joinRoomQuery", ({ name, room }) => {
    const response = addUserToRoom(socket.id, name, room);

    const token = videoToken(name, room, config);

    socket.emit("joinRoomResponse", { response, token: token.toJwt() });
    socket.join(room);
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
    socket.join(room);
  });

  socket.on("startGameQuery", ({ room }) => {
    console.log(`${room} trying to start game`);

    var users = getUsersFromRoom(room);
    console.log("creating game: ", room, users);
    createGame(room, users);
    const response = { status: 0, message: "Success" };

    io.in(room).emit("startGameResponse", {
      response,
    });
  });

  socket.on("sendMessage", ({ message }) => {
    console.log(message);
    const user = getUser(socket.id);
    console.log(user);

    io.to(user.roomName.toUpperCase()).emit("message", {
      user: user.userName,
      text: message,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const user = getUser(socket.id);
    if (user) {
      removeUserFromRoom(socket.id, user.roomName);
    }
  });
});

console.log("server running on port 3001");
