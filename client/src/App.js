import React from "react";

import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Game from "./components/Game";

// import { MemoryRouter as Router, Route } from "react-router-dom";

const App = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [token, setToken] = useState("");
  const [videoRoom, setVideoRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [state, setState] = useState("home");

  socket.on("joinRoomResponse", ({ response, token }) => {
    const { status, message } = response;
    console.log("Success:", response);
    if (status === 0) {
      console.log(name, room, token);
      setToken(token);
      setState("lobby");
    } else {
      alert(message);
    }
  });

  socket.on("createRoomResponse", ({ response, room, token }) => {
    const { status, message } = response;
    console.log("Success:", response);
    console.log(response, room, token);
    if (status === 0) {
      setRoom(room);
      setToken(token);
      setRoom(room);
      setState("lobby");
    } else {
      alert(errorMsg);
    }
  });

  const handleNameChange = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const handleRoomChange = useCallback((event) => {
    setRoom(event.target.value);
  }, []);

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
    render = null;
  } else {
    render = null;
  }

  // return (
  //   <Router>
  //     <Route path="/" exact component={Home} />
  //     <Route path="/lobby" component={Lobby} />
  //     <Route path="/game" component={Game} />
  //   </Router>
  // );
};

export default App;
