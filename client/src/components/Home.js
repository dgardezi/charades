import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

const Home = () => {
  return (
    <div className="homeOuterContainer">
      <div className="homeInnerContainer">
        <h1 className="heading">charades</h1>
        <div>
          <input
            placeholder="nickname"
            className="homeInput"
            type="text"
            onChange={(e) => console.log(e)}
          />
        </div>
        <div>
          <input
            placeholder="game code"
            className="homeInput mt-20"
            type="text"
            onChange={(e) => console.log(e)}
          />
        </div>
        <Link to="/lobby">
          <button className={"button mt-20"} type="submit">
            join
          </button>
        </Link>
        <div className="createGame mt-20">
          <Link to="/lobby">
            <p className="createGameLink">create a game</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
