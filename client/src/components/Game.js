import React, { useEffect, useState } from "react";
import Player from "./Player";
import { socket } from "../Socket";
import "./Game.css";
import ChatBox from "./Chat/ChatBox";

const Game = ({ room, name, videoRoom, players }) => {
  const [actor, setActor] = useState("");
  const [word, setWord] = useState("");
  const [time, setTime] = useState(60);
  const [actorPlayer, setActorPlayer] = useState(null);
  const [guessedWord, setGuessedWord] = useState(false);

  useEffect(() => {
    socket.on("actor", ({ actor }) => {
      console.log("current actor: ", actor);
      setActor(actor);
      setGuessedWord(false);
    });

    socket.on("word", ({ word }) => {
      console.log("current word: ", word);
      setWord(word);
      setGuessedWord(false);
    });

    socket.on("timer", ({ time }) => {
      setTime(time);
    });

    socket.on("guessed", ({ guessed }) => {
      console.log("guessed word!");
      setGuessedWord(true);
    });
  }, []);

  const remotePlayers = players
    .filter((p) => p.identity !== actor)
    .map((player) => (
      <div key={player.sid} className="gameGuesser">
        <Player player={player} />
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
      setActorPlayer(videoRoom.localParticipant);
    } else if (actor !== "") {
      console.log("setting actor to remote participant");
      setActorPlayer(players.filter((p) => p.identity === actor)[0]);
    }
  }, [actor]);

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
          <div className="gameGuessers">
            {videoRoom && actor !== name ? (
              <div key={videoRoom.localParticipant.sid} className="gameGuesser">
                <Player player={videoRoom.localParticipant} />
              </div>
            ) : (
              ""
            )}
            {remotePlayers}
          </div>
          <div className="gameActors">
            {actorPlayer ? (
              <div key={actorPlayer.sid} className="gameActor">
                <Player player={actorPlayer} />
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
