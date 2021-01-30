import React from "react";
import { Link } from "react-router-dom";

import "./Lobby.css";

const Lobby = () => {
  return (
    <div className="lobbyOuterContainer">
      <div className="lobbyInnerContainer">
        <div className="header">
          <h1 className="heading">charades</h1>
          <h2 className="gameCode">a b c d</h2>
        </div>
        <div className="players">
          <div className="player" />
          <div className="player" />
          <div className="player" />
          <div className="player" />
          <div className="player" />
          <div className="player" />
          <div className="player" />
          <div className="player" />
        </div>
        <Link to="/game">
          <button className={"button mt-20"} type="submit">
            join
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Lobby;
