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
  const [token, setToken] = useState("");
  const [videoRoom, setVideoRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [state, setState] = useState("home");
  const [socketsCreated, setSocketsCreated] = useState(false);

  useEffect(() => {
    socket.on("joinRoomResponse", ({ response, token }) => {
      const { status, message } = response;
      console.log("Success:", response);
      if (status === 0) {
        console.log("joinRoomResponse", name, room, token);
        setToken(token);
        setStateLobby(room, token);
      } else {
        alert(message);
      }
    });

    socket.on("createRoomResponse", ({ response, room, token }) => {
      const { status, message } = response;
      console.log("Success:", response);
      console.log("createRoomResponse", room, token);
      if (status === 0) {
        setRoom(room);
        setToken(token);
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
  }, [socketsCreated]);

  

  const handleNameChange = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const handleRoomChange = useCallback((event) => {
    setRoom(event.target.value);
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

  const playerConnected = (player) => {
    console.log("playerConnected", player);
    setPlayers((prevPlayers) => [...prevPlayers, player]);
  };

  const playerDisconnected = (player) => {
    console.log("player disconnected");
    setPlayers((prevPlayers) => prevPlayers.filter((p) => p !== player));
  };

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
    render = (
      <Lobby
        room={room}
        videoRoom={videoRoom}
        players={players}
        playerConnected={playerConnected}
        playerDisconnected={playerDisconnected}
      />
    );
  } else {
    render = (
      <Game
        room={room}
        name={name}
        videoRoom={videoRoom}
        players={players}
      />
    );
  }

  return render;

  // return (
  //   <Router>
  //     <Route path="/" exact component={Home} />
  //     <Route path="/lobby" component={Lobby} />
  //     <Route path="/game" component={Game} />
  //   </Router>
  // );
};

export default App;
