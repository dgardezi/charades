import React from "react";
import Player from "./Player";
import Logo from "../resources/images/logo.svg";
import { socket } from "../Socket";
import "./Lobby.css";

const Lobby = ({ room, players }) => {
  const remotePlayers = players.map((player) => (
    <div key={player.userId} className="player">
      <div className="player-camera">
        <Player player={player} muted={player.call == null} />
      </div>
      <p className="player-name">{player.username}</p>
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
    <div className="lobby-container">
      <div className="header">
        <img
          src={Logo}
          onClick={() => window.location.reload()}
          className="header-logo"
        />
        <h1 className="header-gamecode">{room}</h1>
        <div className="dummy" />
      </div>
      <div className="player-grid">{remotePlayers}</div>
      <div className="start-game-section">
        <p className="player-count">{players.length} / 6 players</p>
        {players.length >= 2 ? (
          <button className="start-button" onClick={startGame}>
            start game
          </button>
        ) : (
          <button className="start-button-disabled">not enough players</button>
        )}
      </div>
    </div>
  );
};

export default Lobby;
