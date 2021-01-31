import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Video from "twilio-video";
import Player from "./Player";

import "./Lobby.css";

const Lobby = () => {
  const location = useLocation();

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [token, setToken] = useState("");
  const [videoRoom, setVideoRoom] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    console.log(location.state);
    setName(location.state.name);
    setRoom(location.state.room);
    setToken(location.state.token);

    if (token !== "") {
      Video.connect(token, {
        name: room,
      })
        .then((room) => {
          setVideoRoom(room);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [room, token]);

  useEffect(() => {
    const playerConnected = (player) => {
      setPlayers((prevPlayers) => [...prevPlayers, player]);
    };

    const playerDisconnected = (player) => {
      setPlayers((prevPlayers) => prevPlayers.filter((p) => p !== player));
    };

    if (videoRoom) {
      videoRoom.on("participantConnected", playerConnected);
      videoRoom.on("participantDisconnected", playerDisconnected);
      videoRoom.participants.forEach(playerConnected);
    }
    return () => {
      if (videoRoom) {
        videoRoom.off("participantConnected", playerConnected);
        videoRoom.off("participantDisconnected", playerDisconnected);
      }
    };
  }, [videoRoom]);

  const remotePlayers = players.map((player) => (
    <div key="{player.id}" className="lobbyPlayer">
      <Player player={player} />
    </div>
  ));

  return (
    <div className="lobbyOuterContainer">
      <div className="lobbyInnerContainer">
        <div className="lobbyHeader">
          <h1>charades.me</h1>
          <h2>game code: {room}</h2>
        </div>

        <div className="lobbyPlayers">
          {videoRoom ? (
            <div key="{videoRoom.localParticipant.sid}" className="lobbyPlayer">
              <Player player={videoRoom.localParticipant} />
            </div>
          ) : (
            ""
          )}

          {remotePlayers}
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
