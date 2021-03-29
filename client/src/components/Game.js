import React, { useEffect, useState, useContext, useCallback } from "react";
import { socket } from "../Socket";
import Player from "./Player";
import Logo from "../resources/images/logo.svg";
import ChatBox from "./Chat/ChatBox";
import "./Game.css";
import { GameContext } from "../GameContext";
import { WordChoices, OverlayMessage } from "./OverlayComponents";

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

const Game = () => {
  const gameContext = useContext(GameContext);

  const [actor, setActor] = useState(gameContext.name);
  const [word, setWord] = useState("");
  const [wordChoices, setWordChoices] = useState([]);
  const [time, setTime] = useState(60);
  const [userPoints, setUserPoints] = useState(null);
  const [actorPlayer, setActorPlayer] = useState(null);
  const [guessedWord, setGuessedWord] = useState(false);
  const [overlayContents, setOverlayContents] = useState(null);

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

    const updateTimerBorder = (percentage) => {
      let timer = document.getElementById("timer");
      let mask = document.getElementById("mask");

      if (timer && mask) {
        if (percentage === 1) {
          timer.style.WebkitTransition = "all 0s linear";
        } else {
          timer.style.WebkitTransition = "all 1s linear";
        }

        var timerPos = -(360 - Math.floor(360 * percentage));
        if (Math.abs(timerPos) < 180) {
          var maskPos = 180;
          mask.style.backgroundColor = "var(--color-pink)";
        } else {
          var maskPos = 0;
          mask.style.backgroundColor = "var(--color-white)";
        }

        timer.style.transform = "rotate(" + timerPos + "deg)";
        mask.style.transform = "rotate(" + maskPos + "deg)";
      }
    };

    socket.on("userConnected", (userId, username) => {
      userJoinAudio.play();
    });

    socket.on("userDisconnected", (userId, username) => {
      userLeaveAudio.play();
    });

    socket.on("actor", ({ actor }) => {
      setActor(actor);
      setGuessedWord(false);
      setOverlayContents(
        <OverlayMessage message={`${actor} is choosing a word`} />
      );
    });

    socket.on("word", ({ word }) => {
      roundStartAudio.play();
      setWord(word);
      setGuessedWord(false);
      setOverlayContents(null);
    });

    socket.on("wordChoices", (wordChoices) => {
      setWordChoices(wordChoices);
      setOverlayContents(
        <WordChoices words={wordChoices} onWordChoice={handleWordChoice} />
      );
    });

    socket.on("timer", ({ time }) => {
      setTime(time);
      if (time >= 0) {
        updateTimerBorder(time / 60);
      }
      if (time <= 9 && time > -1) {
        timerLowAudio.play();
      } else if (time === -1) {
        roundEndAudio.play();
      }
    });

    socket.on("guessed", (username) => {
      guessedCorrectAudio.play();
      if (username === gameContext.name) {
        setGuessedWord(true);
      }
    });

    socket.on("points", (points) => {
      setUserPoints(points);
    });
  }, []);

  const remotePlayers = gameContext.players
    .filter((p) => p.username !== actor)
    .map((player) => (
      <div key={player.userId} className="guesser">
        <div className="guesser-camera">
          <Player player={player} muted={player.call == null} />
        </div>
        <p className="guesser-name">{player.username}</p>
        <p className="guesser-pts">{userPoints !== null ? userPoints[player.username] : 0} pts</p>
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
    if (actor === gameContext.name) {
      setActorPlayer(
        gameContext.players.find(
          (player) => player.username === gameContext.name
        )
      );
    } else if (actor !== "") {
      setActorPlayer(
        gameContext.players.find((player) => player.username === actor)
      );
    }
  }, [actor, gameContext.players]);

  const handleWordChoice = (word) => {
    socket.emit("wordChoice", word);
  };

  const renderWord = () => {
    let render;

    if (gameContext.players.length >= 2) {
      if (actor === gameContext.name || time === -1 || guessedWord) {
        render = (<h1>{word}</h1>);
      }
      else {
        render = (<h1>{getWordHint(word)}</h1>);
      }
    } else {
      if (word !== "") {
        setWord("");
      }
      render = (<h1>Waiting for players</h1>);
    }

    return render;
  };

  return (
    <div className="game-container">
      <div className="header">
        <a href="/">
          <img
            src={Logo}
            className="header-logo"
          />
        </a>
        <div className="word">
          {renderWord()}
        </div>
        <div className="dummy"></div>
      </div>
      <div className="game-components">
        <div className="camera-section">
          <div className="actor">
            {actorPlayer ? (
              <div className="actor-camera">
                <Player
                  player={actorPlayer}
                  muted={true}
                  isActor={true}
                  overlayContents={overlayContents}
                />
              </div>
            ) : (
              ""
            )}
            <p className="guesser-name">
              {actorPlayer ? actorPlayer.username : ""}
            </p>
          </div>
          <div className="guesser-camera-section">{remotePlayers}</div>
        </div>
        <ChatBox room={gameContext.room} name={gameContext.name} />
      </div>
    </div>
  );
};

export default Game;
