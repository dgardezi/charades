import React from "react";
import { socket } from "../Socket";
import "./Home.css";

const Home = ({ name, room, handleNameChange, handleRoomChange }) => {
  const joinRoom = async () => {
    if (name && room) {
      socket.emit("joinRoomQuery", { name, room }, (error) => {
        if (error) {
          alert(error);
        }
      });
    }
  };

  const createRoom = () => {
    if (name) {
      console.log("Trying to create new room");
      socket.emit("createRoomQuery", { name }, (error) => {
        if (error) {
          alert(error);
        }
      });
    }
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
            onChange={handleNameChange}
          />
          <input
            placeholder="game code"
            className="gamecodeInput"
            type="text"
            onChange={handleRoomChange}
          />
          <div className="joinButtonLink" onClick={joinRoom}>
            <button className={"joinButton"} type="submit">
              join
            </button>
          </div>
        </div>

        <div className="createGame">
          <div className="createGameLink" onClick={createRoom}>
            <p>create a game</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
