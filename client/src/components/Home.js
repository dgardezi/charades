import React from "react";
import Logo from "../resources/images/logo.svg";
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
    <div className="home-container">
      <div className="logo-section">
        <div className="logo">
          <img src={Logo} className="logo-image" />
          <p className="logo-subtext">
            face to face fun with the ones you love,
            <br />
            minus the risk.
          </p>
        </div>
      </div>
      <div className="login-section">
        <div className="login-form">
          <h1 className="title">charades</h1>
          <input
            className="login-input"
            type="text"
            placeholder="nickname"
            maxLength="15"
            onChange={handleNameChange}
          />
          <input
            className="login-input"
            type="text"
            placeholder="game code"
            maxLength="4"
            onChange={handleRoomChange}
          />
          <div className="login-buttons">
            <button className="join-button" onClick={joinRoom}>
              join game
            </button>
            <button className="create-button" onClick={createRoom}>
              create a game
            </button>
          </div>
        </div>
        <div className="footer">
          <p className="footer-creators">
            created by{" "}
            <a
              href="https://www.linkedin.com/in/dmercer10/"
              target="_blank"
              className="creator-name"
            >
              duncan mercer
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/durongardezi/"
              target="_blank"
              className="creator-name"
            >
              duron gardezi
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/griffin-bentley-72b391199/"
              target="_blank"
              className="creator-name"
            >
              griffin bentley
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
