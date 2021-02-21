import React, { useEffect, useState } from "react";
import Player from "./Player";
import { socket } from "../Socket";
import "./Game.css";
import ChatBox from "./Chat/ChatBox";

// Sound Effects
// -------------------
// User Join
import userJoinSound from "../resources/sounds/playerJoin.mp3";
// User leave
import userLeaveSound from "../resources/sounds/playerLeave.mp3";
// User guesses word correct
import guessCorrectSound from "../resources/sounds/correctGuess.mp3";
// Timer getting low
import timerLowSound from "../resources/sounds/timerLow.mp3";
// Round end
import roundEndSound from "../resources/sounds/roundEnd.mp3";
// Round start
import roundStartSound from "../resources/sounds/roundStart.mp3";

const Game = ({ room, name, players }) => {
  const [actor, setActor] = useState("");
  const [word, setWord] = useState("");
  const [time, setTime] = useState(60);
  const [userPoints, setUserPoints] = useState(null);
  const [actorPlayer, setActorPlayer] = useState(null);
  const [guessedWord, setGuessedWord] = useState(false);

  useEffect(() => {
    var guessedCorrectAudio = new Audio(guessCorrectSound);
    guessedCorrectAudio.volume = 0.2;
    var userJoinAudio = new Audio(userJoinSound);
    userJoinAudio.volume = 0.2;
    var userLeaveAudio = new Audio(userLeaveSound);
    userLeaveAudio.volume = 0.2;
    var timerLowAudio = new Audio(timerLowSound);
    timerLowAudio.volume = 0.2;
    var roundStartAudio = new Audio(roundStartSound);
    roundStartAudio.volume = 0.2;
    var roundEndAudio = new Audio(roundEndSound);
    roundEndAudio.volume = 0.2;

    socket.on("userConnected", (userId, username) => {
      userJoinAudio.play();
    });

    socket.on("userDisconnected", (userId, username) => {
      userLeaveAudio.play();
    });

    socket.on("actor", ({ actor }) => {
      console.log("current actor: ", actor);
      setActor(actor);
      setGuessedWord(false);
    });

    socket.on("word", ({ word }) => {
      console.log("current word: ", word);
      roundStartAudio.play();
      setWord(word);
      setGuessedWord(false);
    });

    socket.on("timer", ({ time }) => {
      setTime(time);
      if (time <= 10 && time > 0) {
        timerLowAudio.play();
      } else if (time === 0) {
        roundEndAudio.play();
      }
    });

    socket.on("guessed", (username) => {
      console.log(`${username} guessed word!`);
      guessedCorrectAudio.play();
      if (username === name) {
        setGuessedWord(true);
      }
    });

    socket.on("points", (points) => {
      console.log("received points", points);
      setUserPoints(points);
      console.log(points);
    });
  }, []);

  const remotePlayers = players
    .filter((p) => p.username !== actor)
    .map((player) => (
      <div key={player.userId} className="gameGuesser">
        <Player player={player} muted={player.call == null} />
        <p>{userPoints !== null ? userPoints[player.username] : 0}</p>
      </div>
    ));

  const getWordHint = (word) => {
    var result = "";
    var i;
    for (i = 0; i < word.length; i++) {
      result += word[i] === " " ? "\xa0\xa0" : "_\xa0";
    }
    return result.slice(0, -1);
  };

  useEffect(() => {
    if (actor === name) {
      console.log("setting actor player to local participant");
      setActorPlayer(players.find((player) => player.username === name));
    } else if (actor !== "") {
      console.log("setting actor to remote participant");
      setActorPlayer(players.find((player) => player.username === actor));
    }
  }, [actor, players]);

  return (
    <div className="gameOuterContainer">
      <div className="gameInnerContainer">
        <div className="gameWord">
          {actor === name || time === 0 || guessedWord ? (
            <h1>{word}</h1>
          ) : (
            <h1>{getWordHint(word)}</h1>
          )}
        </div>

        <h1 className="gameTimer">{time}</h1>

        <div className="gameView">
          <div className="gameGuessers">{remotePlayers}</div>
          <div className="gameActors">
            {actorPlayer ? (
              <div key={actorPlayer.sid} className="gameActor">
                <Player player={actorPlayer} muted={true} />
              </div>
            ) : (
              "loading next round's actor ..."
            )}
          </div>
          <div className="gameChat">
            <div className="gameChatWindow">
              <ChatBox room={room} name={name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
