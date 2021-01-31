import React, { useEffect, useState } from "react";
import Player from "./Player";
import { socket } from "../Socket";
import "./Game.css";
import ChatBox from "./Chat/ChatBox";

const Game = ({ room, name, videoRoom, players }) => {
  const [socketsCreated, setSocketsCreated] = useState(false);
  const [actor, setActor] = useState("");
  const [word, setWord] = useState("");
  const [time, setTime] = useState(60);

  useEffect(() => {
    socket.on("actor", ({ actor }) => {
      console.log("current actor: ", actor);
      setActor(actor);
    });

    socket.on("word", ({ word }) => {
      console.log("current word: ", word);
      setWord(word);
    });

    socket.on("timer", ({ time }) => {
      console.log("current timer: ", time);
      setTime(time);
    });
  }, [socketsCreated]);

  const remotePlayers = players.map((player) => (
    <div key="{player.id}" className="gameGuesser">
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

  return (
    <div className="gameOuterContainer">
      <div className="gameInnerContainer">
        <div className="gameWord">
          {actor === name || time === 0 ? (
            <h1>{word}</h1>
          ) : (
            <h1>{getWordHint(word)}</h1>
          )}
        </div>

        <h1 className="gameTimer">{time}</h1>

        <div className="gameView">
          <div className="gameGuessers">
            {videoRoom ? (
              <div
                key="{videoRoom.localParticipant.sid}"
                className="gameGuesser"
              >
                <Player player={videoRoom.localParticipant} />
              </div>
            ) : (
              ""
            )}

            {remotePlayers}
          </div>
          <div className="gameActors">
            <div className="gameActor"></div>
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
