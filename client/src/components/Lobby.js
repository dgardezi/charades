import React from "react";
import Player from "./Player";
import { socket } from "../Socket";

import "./Lobby.css";

const Lobby = ({ room, players }) => {
  const remotePlayers = players.map((player) => (
    <div key={player.id} className="lobbyPlayer">
      <Player player={player} muted={player.call === null} />
    </div>
  ));

  const startGame = () => {
    console.log("starting game");
    socket.emit("startGameQuery", { room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  };

  return (
    <div className="lobbyOuterContainer">
      <div className="lobbyInnerContainer">
        <div className="lobbyHeader">
          <h1>charades.me</h1>
          <h2>game code: {room}</h2>
        </div>

        <div className="lobbyPlayers">{remotePlayers}</div>
        <div className="startGame">
          <div className="startButtonLink">
            <button onClick={startGame} className={"startButton"} type="submit">
              start game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
