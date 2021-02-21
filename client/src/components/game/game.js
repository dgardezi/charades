import React from "react";
import Logo from "../../images/logo.svg";
import "./game.css";

const Game = () => (
  <div className="game-container">
    <div className="header">
      <img src={Logo} onClick={() => window.location.reload()} className="header-logo" />
      <h1 className="word">_ _ _ _ _ _ _</h1>
      <div className="dummy"></div>
    </div>
    <div className="timer" />
    <div className="game-components">
      <div className="camera-section">
        <div className="actor-camera" />
        <div className="guesser-camera-section">
          <div className="guesser-camera" />
          <div className="guesser-camera" />
          <div className="guesser-camera" />
          <div className="guesser-camera" />
          <div className="guesser-camera" />
        </div>
      </div>
      <div className="chatbox" />
    </div>
  </div>
);

export default Game;
