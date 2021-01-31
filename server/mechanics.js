const { words } = require("./words");
const activeGames = new Map(); // { userPoints,currentOrder,currentActor,currentWord,timer,lastTimerUpdate
const timeoutBetweenGames = 5000; //in milliseconds
const { sendActor } = require("./index");
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

  activeGames.set(room, {
    userPoints,
    currentOrder,
    currentActor,
    currentWord,
    timer,
    lastTimerUpdate,
    revealed,
  });

  var running = setInterval(runGame, 100, room);
};

const runGame = (room) => {
  if (activeGames.has(room)) {
    if (activeGames.get(room).timer < 0) {
      if (!activeGames.get(room).revealed) {
        // send reveal to everyone
        activeGames.get(room).revealed = true;
        activeGames.get(room).currentActor += 1;
      }
      // Wait for time to pass before starting game
      var timeSinceLastGame =
        currentTime() - activeGames.get(room).lastTimerUpdate;
      var roomData = activeGames.get(room);
      if (timeSinceLastGame > timeoutBetweenGames) {
        if (roomData.currentActor > roomData.currentOrder.length) {
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

        roomData.timer = 60;

        //send timer

        roomData.lastTimerUpdate = currentTime();
        roomData.revealed = false;
      } else {
        console.log("waiting between games: ", timeSinceLastGame);
      }
    } else {
      var timeSinceLastUpdate =
        currentTime() - activeGames.get(room).lastTimerUpdate;
      if (timeSinceLastUpdate > 1000) {
        activeGames.get(room).timer -= 1;

        // send update timer

        activeGames.get(room).lastTimerUpdate = currentTime();
      }

      console.log(activeGames.get(room));
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

const addUserPoint = (username, room) => {
  activeGames.get(room).userPoints.get(username) += 50;
};

module.exports = { createGame };
