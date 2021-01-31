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

  if (state === "home") {
  } else if (state === "lobby") {
  } else {
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
