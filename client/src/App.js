import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Game from "./components/Game";

import { socket } from "./Socket";

// import { MemoryRouter as Router, Route } from "react-router-dom";

const App = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [videoRoom, setVideoRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [state, setState] = useState("home");

  useEffect(() => {
    socket.on("joinRoomResponse", ({ response, room, token }) => {
      const { status, message } = response;
      console.log("Success:", response);
      if (status === 0) {
        setRoom(room);
        setStateLobby(room, token);
      } else {
        alert(message);
      }
    });

    socket.on("startGameResponse", ({ response }) => {
      const { status, message } = response;
      console.log("Success:", response);
      if (status === 0) {
        setState("game");
      } else {
        alert(message);
      }
    });
  }, []);

  const handleNameChange = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const handleRoomChange = useCallback((event) => {
    setRoom(event.target.value.trim().toUpperCase());
  }, []);

  const setStateLobby = (room, tok) => {
    console.log("setsStateLobby", room, tok);
    Video.connect(tok, {
      name: room,
    }).then((r) => {
      setVideoRoom(r);
      setState("lobby");
    });
  };

  useEffect(() => {
    const playerConnected = (player) => {
      console.log("playerConnected", player);
      setPlayers((prevPlayers) => [...prevPlayers, player]);
    };

    const playerDisconnected = (player) => {
      console.log("player disconnected");
      setPlayers((prevPlayers) => prevPlayers.filter((p) => p !== player));
    };

    if (videoRoom) {
      console.log(`creating video room events for ${state}`);
      videoRoom.on("participantConnected", playerConnected);
      videoRoom.on("participantDisconnected", playerDisconnected);
      videoRoom.participants.forEach(playerConnected);
    }

    return () => {
      if (videoRoom) {
        console.log(`removing video room events for ${state}`);
        videoRoom.off("participantConnected", playerConnected);
        videoRoom.off("participantDisconnected", playerDisconnected);
        videoRoom.participants.forEach(playerDisconnected);
      }
    };
  }, [state]);

  const handleLeave = () => {
    setVideoRoom((prevVideoRoom) => {
      if (prevVideoRoom) {
        prevVideoRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        console.log("Disconnecting from room");
        prevVideoRoom.disconnect();
      }
      return null;
    });
  };

  useEffect(() => {
    if (videoRoom) {
      const cleanUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (videoRoom) {
          handleLeave();
        }
      };
      // window.addEventListener("pagehide", cleanUp);
      window.addEventListener("beforeunload", cleanUp);
      return () => {
        // window.removeEventListener("pagehide", cleanUp);
        window.removeEventListener("beforeunload", cleanUp);
      };
    }
  }, [videoRoom]);

  let render;
  if (state === "home") {
    render = (
      <Home
        name={name}
        room={room}
        handleNameChange={handleNameChange}
        handleRoomChange={handleRoomChange}
      />
    );
  } else if (state === "lobby") {
    render = <Lobby room={room} videoRoom={videoRoom} players={players} />;
  } else {
    render = (
      <Game room={room} name={name} videoRoom={videoRoom} players={players} />
    );
  }

  return render;
};

export default App;
