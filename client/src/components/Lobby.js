import React from "react";
import { Link } from "react-router-dom";

import "./Lobby.css";

const Lobby = () => {
  return (
    <div className="lobbyOuterContainer">
      <div className="lobbyInnerContainer">

        <div className="lobbyHeader">
          <h1>charades.me</h1>
          <h2>game code: abcd</h2>
        </div>

        <div className="lobbyPlayers">
          <div className="lobbyPlayer" />
          <div className="lobbyPlayer" />
          <div className="lobbyPlayer" />
          <div className="lobbyPlayer" />
          <div className="lobbyPlayer" />
          <div className="lobbyPlayer" />
          <div className="lobbyPlayer" />
          <div className="lobbyPlayer" />
        </div>

        <div className="startGame">
          <Link to="/game" className="startButtonLink">
            <button className={"startButton"} type="submit">
              start game
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Lobby;
