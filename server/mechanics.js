const { words } = require("./words");
const activeGames = new Map(); // { userPoints,currentOrder,currentActor,currentWord,timer,lastTimerUpdate, guessedCorrectly
const timeoutBetweenGames = 5000; //in milliseconds
const { io } = require("./socket.js");
const currentTime = () => {
  return new Date().getTime();
};

const createGame = (room, users) => {
  // Map (keys: userName, value: points)
  let userPoints = new Map(users.map((u) => [u.userName, 0]));
  console.log(userPoints);
  var currentOrder = [...userPoints.keys()];
  var currentActor = -1;
  var currentWord = null;
  var timer = -1;
  var lastTimerUpdate = currentTime();
  var revealed = false;
  var guessedCorrectly = null; // Set of players who have guessed the word

  activeGames.set(room, {
    userPoints,
    currentOrder,
    currentActor,
    currentWord,
    timer,
    lastTimerUpdate,
    revealed,
    guessedCorrectly,
  });

  // The thread id to be used to close the game
  var gameId = setInterval(runGame, 100, room);
  activeGames.get(room).gameId = gameId;
};

const endGame = (room) => {
  room = room.toUpperCase();
  if (activeGames.has(room)) {
    console.log(`Ending game for room ${room}`);
    clearInterval(activeGames.get(room).gameId);
    activeGames.delete(room);
  }
};

const addUserToGame = (room, username) => {
  room = room.toUpperCase();
  if (activeGames.has(room)) {
    var roomData = activeGames.get(room);
    if (!roomData.userPoints.has(username)) {
      console.log(`Adding ${username} to ${room}!`);
      roomData.userPoints.set(username, 0);
      roomData.currentOrder.push(username);

      if (roomData.userPoints.size !== 2) {
        // Resend the actor and word for new user if game is started
        var actor = roomData.currentOrder[roomData.currentActor];
        var word = roomData.currentWord;

        if (word) {
          io.in(room).emit("actor", { actor });
          io.in(room).emit("word", { word });
        }
      } else {
        roomData.timer = 0;
        roomData.lastTimerUpdate = currentTime();
      }
    }
  }
};

const removeUserFromGame = (room, username) => {
  room = room.toUpperCase();
  if (activeGames.has(room)) {
    var roomData = activeGames.get(room);
    var isActor = roomData.currentOrder[roomData.currentActor] === username;

    if (roomData.userPoints.has(username)) {
      // Remove user from users with points and actor candidates
      console.log(`Removing ${username} from ${room}`);
      roomData.userPoints.delete(username);
      const index = roomData.currentOrder.indexOf(username);
      if (index > -1) {
        roomData.currentOrder.splice(index, 1);
      }

      // If user leaves as the current actor, end the turn
      if (isActor) {
        roomData.timer = 0;
      }
    }

    // If lastUser in room, endGame
    if (roomData.userPoints.size === 0) {
      endGame(room);
    } else if (roomData.userPoints.size === 1) {
      roomData.timer = 0;
    }
  }
};

const runGame = (room) => {
  room.toUpperCase();
  if (activeGames.has(room)) {
    var roomData = activeGames.get(room);
    if (
      roomData.timer <= 0 ||
      (roomData.userPoints.size !== 1 &&
        roomData.guessedCorrectly.size === roomData.userPoints.size - 1)
    ) {
      if (!roomData.revealed) {
        roomData.revealed = true;
        roomData.currentActor += 1;
      }
      // Wait for time to pass before starting game
      var timeSinceLastGame = currentTime() - roomData.lastTimerUpdate;

      if (timeSinceLastGame > timeoutBetweenGames) {
        if (roomData.currentActor >= roomData.currentOrder.length) {
          // Start new round
          // Get random order of actors
          roomData.currentOrder = shuffle(roomData.currentOrder);
          roomData.currentActor = 0;
        }

        //sendActor
        var actor = roomData.currentOrder[roomData.currentActor];
        console.log("sending actor: ", actor);
        io.in(room).emit("actor", { actor });

        roomData.currentWord = getRandomWord();

        //sendWord
        var word = roomData.currentWord;
        io.in(room).emit("word", { word });

        roomData.guessedCorrectly = new Set();

        roomData.timer = 60;

        //send timer
        var time = roomData.timer;
        io.in(room).emit("timer", { time });

        roomData.lastTimerUpdate = currentTime();
        roomData.revealed = false;
      }
    } else {
      var timeSinceLastUpdate = currentTime() - roomData.lastTimerUpdate;
      if (timeSinceLastUpdate > 1000 && roomData.userPoints.size !== 1) {
        roomData.timer -= 1;

        // send update timer
        var time = roomData.timer;
        io.in(room).emit("timer", { time });

        roomData.lastTimerUpdate = currentTime();
      }
    }
  } else {
    console.log("An unexpected error has occured while running game.");
  }
};

const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)];
};

const isGameActive = (room) => {
  return activeGames.has(room);
};

const userGuess = (room, username, guess) => {
  var r = room.toUpperCase();

  // If the room exists
  if (activeGames.has(r)) {
    var gameData = activeGames.get(r);

    // If username exists in room and is not the current actor
    if (
      gameData.userPoints.has(username) &&
      gameData.currentOrder[gameData.currentActor] != username
    ) {
      // If the user has not already guessed correctly
      if (!gameData.guessedCorrectly.has(username)) {
        // If the guess is the same as the word
        if (
          guess.trim().toLowerCase() ===
          gameData.currentWord.trim().toLowerCase()
        ) {
          gameData.guessedCorrectly.add(username);
          addUserPoint(username, room);
          return true;
        }
      }
    }
  }
  return false;
};

const isSpoiler = (room, message) => {
  var r = room.toUpperCase();
  console.log(room, message, activeGames);
  if (activeGames.has(r)) {
    var gameData = activeGames.get(r);

    if (
      message.trim().toLowerCase().includes(gameData.currentWord.toLowerCase())
    ) {
      return true;
    }
  }
  return false;
};

const addUserPoint = (username, room) => {
  var gameData = activeGames.get(room.toUpperCase());
  gameData.userPoints.set(
    username,
    gameData.userPoints.get(username) + gameData.timer * 10
  ); // * 1/gussedCorrectly.length());
  gameData.userPoints.set(
    gameData.currentOrder[gameData.currentActor],
    gameData.userPoints.get(gameData.currentOrder[gameData.currentActor]) + 100
  );
};

const getUserPoints = (room) => {
  // console.log(activeGames.get(room.toUpperCase()).userPoints);
  return activeGames.get(room.toUpperCase()).userPoints;
};

module.exports = {
  createGame,
  userGuess,
  addUserPoint,
  isSpoiler,
  endGame,
  removeUserFromGame,
  isGameActive,
  addUserToGame,
  getUserPoints,
};
