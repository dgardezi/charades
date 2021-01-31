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

  var running = setInterval(runGame, 100, room);
};

const runGame = (room) => {
  if (activeGames.has(room)) {
    if (activeGames.get(room).timer <= 0) {
      if (!activeGames.get(room).revealed) {
        activeGames.get(room).revealed = true;
        activeGames.get(room).currentActor += 1;
      }
      // Wait for time to pass before starting game
      var timeSinceLastGame =
        currentTime() - activeGames.get(room).lastTimerUpdate;
      var roomData = activeGames.get(room);
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
      var timeSinceLastUpdate =
        currentTime() - activeGames.get(room).lastTimerUpdate;
      if (timeSinceLastUpdate > 1000) {
        activeGames.get(room).timer -= 1;

        // send update timer
        var time = activeGames.get(room).timer;
        io.in(room).emit("timer", { time });

        activeGames.get(room).lastTimerUpdate = currentTime();
      }
    }
  } else {
    clearInterval(running);
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

const gameActive = (room) => {
  return activeGames.has(room);
};

const userGuess = (room, username, guess) => {
  var r = room.toUpperCase();
  if (activeGames.has(r)) {
    var gameData = activeGames.get(r);
    if (
      gameData.userPoints.has(username) &&
      gameData.currentOrder[gameData.currentActor] != username
    ) {
      if (!gameData.guessedCorrectly.has(username)) {
        if (
          guess.trim().toLowerCase() ===
          gameData.currentWord.trim().toLowerCase()
        ) {
          gameData.guessedCorrectly.add(username);
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

    if (gameData.currentWord.toLowerCase() === message.trim().toLowerCase()) {
      return true;
    }
  }
  return false;
};

const addUserPoint = (username, room) => {
  activeGames.get(room).userPoints.get(username) += 50;
};

module.exports = { createGame, userGuess, addUserPoint, isSpoiler };
