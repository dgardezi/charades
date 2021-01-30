import React from "react";
import { Link } from "react-router-dom";

import "./Game.css";

const Game = () => {
  return (
    <div className="lobbyOuterContainer">
      <div className="lobbyInnerContainer">
        <div className="header">
          <h1 className="heading">charades</h1>
        </div>
        <div className="gameView">
          <div className="guessers">
            <div className="guesser"></div>
            <div className="guesser"></div>
            <div className="guesser"></div>
            <div className="guesser"></div>
            <div className="guesser"></div>
            <div className="guesser"></div>
            <div className="guesser"></div>
          </div>
          <div className="actor">
            <p>actor camera</p>
          </div>
          <div className="chat">
            <p>chat window</p>
          </div>
        </div>
        <div className="footer">
          <h1 className="gameCode">a b c d</h1>
        </div>
      </div>
    </div>
  );
};

export default Game;
