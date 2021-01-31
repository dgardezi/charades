import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { socket } from "../Socket";

import "./Lobby.css";

const Lobby = () => {
  const location = useLocation();

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    setName(location.state.name);
    setRoom(location.state.room);
  });

  return (
    <div className="lobbyOuterContainer">
      <div className="lobbyInnerContainer">
        <div className="lobbyHeader">
          <h1>charades.me</h1>
          <h2>game code: {room}</h2>
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
