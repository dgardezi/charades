import React from "react";

import "./Game.css";

const Game = () => {
  return (
    <div className="gameOuterContainer">
      <div className="gameInnerContainer">

        <div className="gameWord">
          <h1>_ _ _ _ _ _ _</h1>
        </div>

        {/* ANCHOR LOADING BAR TO TOP OF GAMEVIEW */}
        <div className="gameView">
          <div className="gameGuessers">
            <div className="gameGuesser"></div>
            <div className="gameGuesser"></div>
            <div className="gameGuesser"></div>
            <div className="gameGuesser"></div>
            <div className="gameGuesser"></div>
            <div className="gameGuesser"></div>
            <div className="gameGuesser"></div>
          </div>
          <div className="gameActors">
          <div className="gameActor"></div>
          </div>
          <div className="gameChat">
            <div className="gameChatWindow">
              <p>chat window</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Game;
