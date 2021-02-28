import React, { useContext, useEffect, useCallback } from "react";
import Logo from "../resources/images/logo.svg";
import { socket } from "../Socket";
import "./Home.css";
import { GameContext } from "../GameContext";

const Home = () => {
  const gameContext = useContext(GameContext);

  const handleNameChange = useCallback((event) => {
    gameContext.setName(event.target.value);
  }, []);

  const handleRoomChange = useCallback((event) => {
    gameContext.setRoom(event.target.value.trim().toUpperCase());
  }, []);

  const joinRoom = () => {
    if (gameContext.name && gameContext.room) {
      console.log("Trying to join room ", gameContext.room);
      socket.emit(
        "joinRoomQuery",
        { name: gameContext.name, room: gameContext.room },
        (error) => {
          if (error) {
            alert(error);
          }
        }
      );
    }
  };

  const createRoom = () => {
    if (gameContext.name) {
      console.log("Trying to create new room");
      socket.emit("createRoomQuery", { name: gameContext.name }, (error) => {
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
