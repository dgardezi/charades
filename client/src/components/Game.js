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
  const [actorPlayer, setActorPlayer] = useState(null);

  const isActor = () => {
    return actor.localeCompare(videoRoom.localParticipant.identity) === 0;
  }

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

  const remotePlayers = players.filter((p) => p.identity !== actor).map((player) => (
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

  useEffect(() => {
    if (actor === name) {
      console.log("setting actor player to local participant");
      setActorPlayer(videoRoom.localParticipant);
    } else {
      console.log("setting actor to remote participant");
      setActorPlayer(players.filter((p) => p.identity === actor)[0]);
    }
    console.log(actorPlayer);
  }, [actor]);

  console.log(actorPlayer);
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
            {videoRoom && actor !== name ? (
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
            {actorPlayer ? (
              <div
                key="{actorPlayer.sid}"
                className="gameActor"
              >
                <Player player={actorPlayer} />
              </div>
            ) : ("no actorplayer found")}
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
