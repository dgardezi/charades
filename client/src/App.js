import React from 'react';

import Home from './components/Home';
import Lobby from './components/Lobby';
import Game from './components/Game';

import { MemoryRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/lobby" component={Lobby} />
      <Route path="/game" component={Game} />
    </Router>
  );
}

export default App;
