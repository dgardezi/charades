const { v4: uuid_v4 } = require("uuid");
const config = require("./config");
const { io } = require("./socket");
const {
  addUserToRoom,
  createRoom,
  removeUserFromRoom,
  getUsersFromRoom,
  getUser,
  closeRoom,
  isRoomOpen,
} = require("./rooms");
const {
  createGame,
  userGuess,
  addUserPoint,
  isSpoiler,
  endGame,
  removeUserFromGame,
  isGameActive,
  addUserToGame,
  getUserPoints,
} = require("./mechanics");

io.engine.generateId = (req) => {
  return uuid_v4();
};

io.on("connect", (socket) => {
  socket.on("joinRoomQuery", ({ name, room }) => {
    console.log(`${name} trying to join ${room}`);
    var response = addUserToRoom(socket.id, name, room);

    socket.emit("joinRoomResponse", {
      response,
      room: room,
    });
    socket.join(room);

    // If user could join room succesfully
    if (response.status === 0) {
      // If game has already started, send user a message to start game
      if (isGameActive(room)) {
        response = { status: 0, message: "Success" };
        socket.emit("startGameResponse", {
          response,
        });

        addUserToGame(room, name);
      }
    }
  });

  // Once user has successfully connected to room,
  // let all other users know.
  // Cannot be in joinRoomResponse since client needs time to setup sockets.
  socket.on("userConnected", (room) => {
    console.log("userConnected", room, socket.id, getUser(socket.id).userName);
    // Let all other users that user has connected
    socket
      .to(room)
      .broadcast.emit("userConnected", socket.id, getUser(socket.id).userName);
    socket.to(room).broadcast.emit("message", {
      user: "",
      text: `${getUser(socket.id).userName} has joined the room`,
    });
  });

  socket.on("createRoomQuery", ({ name }) => {
    console.log(`${name} tried to make a new room`);

    const room = createRoom();
    const response = addUserToRoom(socket.id, name, room);

    socket.emit("joinRoomResponse", {
      response,
      room: room,
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

    // Check if they have an active running game
    // if yes, check if they have already guessed the word
    // if no
    // they guessed correctly
    var correct = userGuess(user.roomName, user.userName, message);

    if (correct) {
      //broadcast to rest of users points update
      //broadcast to correct user to reveal word
      socket.emit("guessed", "true");
      socket.emit(
        "points",
        Object.fromEntries(getUserPoints(user.roomName.toUpperCase()))
      );

      io.to(user.roomName.toUpperCase()).emit("message", {
        user: "",
        text: `${user.userName} has guessed the word!`,
      });
    } else {
      if (!isSpoiler(user.roomName, message)) {
        io.to(user.roomName.toUpperCase()).emit("message", {
          user: user.userName,
          text: message,
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const user = getUser(socket.id);

    if (user) {
      socket.to(user.roomName.toUpperCase()).broadcast.emit("message", {
        user: "",
        text: `${user.userName} has left the room`,
      });

      console.log(
        `${user.userName} disconnected from ${user.roomName.toUpperCase()}`
      );
      io.in(user.roomName.toUpperCase()).emit("userDisconnected", {
        userId: socket.id,
      });

      removeUserFromRoom(socket.id, user.roomName);
      removeUserFromGame(user.roomName, user.userName);
    }
  });
});

console.log("server running on port 3001");
