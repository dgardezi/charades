import React, { useEffect, useState } from "react";
import { socket } from "../Socket";
import "./Home.css";

const url = "http://localhost:3001";

const Home = ({ name, room, handleNameChange, handleRoomChange }) => {
  const joinRoom = async () => {
    const data = { name: name, room: room };
    if (name && room) {
      console.log(name, room);
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
      console.log(name);
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

// await fetch(url + "/joinRoom", {
//   method: "POST", // or 'PUT'
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(data),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     const { status, message } = data.response;
//     console.log("Success:", data);
//     if (status === 0) {
//       history.push({
//         pathname: "/lobby",
//         state: { name: name, room: room, token: data.token },
//       });
//     } else {
//       setErrorMsg(message);
//       alert(message);
//     }
//   });

// await fetch(url + "/createRoom", {
//   method: "POST", // or 'PUT'
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(data),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     const { status, message } = data.response;
//     console.log("Success:", data);
//     if (status === 0) {
//       history.push({
//         pathname: "/lobby",
//         state: { name: name, room: data.room, token: data.token },
//       });
//     } else {
//       setErrorMsg(message);
//       alert(errorMsg);
//     }
//   });
