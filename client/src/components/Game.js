import React, { useEffect } from "react";
import Player from "./Player";

import "./Game.css";
import ChatBox from "./Chat/ChatBox";

const Game = ({room, name, videoRoom, players}) => {
  // useEffect(() => {
  //   if (videoRoom) {
  //     videoRoom.on("participantConnected", playerConnected);
  //     videoRoom.on("participantDisconnected", playerDisconnected);
  //     videoRoom.participants.forEach(playerConnected);
  //   }
  //   return () => {
  //     if (videoRoom) {
  //       videoRoom.off("participantConnected", playerConnected);
  //       videoRoom.off("participantDisconnected", playerDisconnected);
  //     }
  //   };
  // }, [videoRoom]);

  console.log(players);
  const remotePlayers = players.map((player) => (
    <div key="{player.id}" className="gameGuesser">
      <Player player={player} />
    </div>
  ));
  

  return (
    <div className="gameOuterContainer">
      <div className="gameInnerContainer">
        <div className="gameWord">
          <h1>_ _ _ _ _ _ _</h1>
        </div>

        {/* ANCHOR LOADING BAR TO TOP OF GAMEVIEW */}
        <div className="gameView">
        <div className="gameGuessers">
          {videoRoom ? (
            <div key="{videoRoom.localParticipant.sid}" className="gameGuesser">
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
              <ChatBox room={room} name={name}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
