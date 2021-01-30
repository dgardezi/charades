import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
  return (
    <div className="homeOuterContainer">
      <div className="homeInnerContainer">

        <div className="homeHeader">
          <h1>charades.me</h1>
        </div>

        <div className="joinRoomForm">
          <input
            placeholder="nickname"
            className="nicknameInput"
            type="text"
            onChange={(e) => console.log(e)}
          />
          <input
            placeholder="game code"
            className="gamecodeInput"
            type="text"
            onChange={(e) => console.log(e)}
          />
          <Link to="/lobby" className="joinButtonLink">
            <button className={"joinButton"} type="submit">
              join
            </button>
          </Link>
        </div>

        <div className="createGame">
          <Link to="/lobby" className="createGameLink">
            <p>create a game</p>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Home;
