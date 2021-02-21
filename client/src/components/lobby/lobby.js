import React from "react";
import Logo from "../../images/logo.svg";
import "./lobby.css";

const Lobby = () => (
  <div className="lobby-container">
    <div className="header">
      <img src={Logo} onClick={() => window.location.reload()} className="header-logo" />
      <h1 className="header-gamecode">{room}</h1>
      <div className="dummy" />
    </div>
    <div className="player-grid">
      {remotePlayers}
    </div>
    <div className="start-game-section">
      <p className="player-count">{players.length} / 6 players</p>
      {players.length >= 2 ? (
        <button className="start-button" onClick={startGame}>
          start game
        </button>
      ) : (
        <button className="start-button-disabled">
          not enough players
        </button>
      )}
    </div>
  </div>
);

export default Lobby;
