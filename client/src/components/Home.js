import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";

import "./Home.css";

const url = "http://localhost:3001";

const Home = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  let history = useHistory();

  const joinRoom = async () => {
    const data = { name: name, room: room };
    if (name && room) {
      await fetch(url + "/joinRoom", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          const { status, message } = data.response;
          console.log("Success:", data);
          if (status === 0) {
            history.push({
              pathname: "/lobby",
              state: { name: name, room: room, token: data.token },
            });
          } else {
            setErrorMsg(message);
            alert(message);
          }
        });
    }
  };

  const createRoom = async () => {
    const data = { name: name };
    if (name) {
      console.log("Trying to create new room");
      await fetch(url + "/createRoom", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          const { status, message } = data.response;
          console.log("Success:", data);
          if (status === 0) {
            history.push({
              pathname: "/lobby",
              state: { name: name, room: data.room, token: data.token },
            });
          } else {
            setErrorMsg(message);
            alert(errorMsg);
          }
        });
    }

    return false;
  };

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
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="game code"
            className="gamecodeInput"
            type="text"
            onChange={(e) => setRoom(e.target.value)}
          />
          <Link className="joinButtonLink" onClick={joinRoom} to="">
            <button className={"joinButton"} type="submit">
              join
            </button>
          </Link>
        </div>

        <div className="createGame">
          <Link className="createGameLink" onClick={createRoom} to="">
            <p>create a game</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
