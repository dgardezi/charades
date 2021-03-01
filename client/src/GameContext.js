import React, { useContext, useState } from "react";

export const GameContext = React.createContext();

export function GameProvider({ children }) {
  //STATE GOES HERE
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [players, setPlayers] = useState([]); // player = {userId, username, stream, call, volume}
  const [state, setState] = useState("home");
  const [myPeer, setMyPeer] = useState(null);

  const gameData = {
    name,
    room,
    setName,
    setRoom,
    players,
    setPlayers,
    state,
    setState,
    myPeer,
    setMyPeer,
  };

  return (
    <GameContext.Provider value={gameData}>{children}</GameContext.Provider>
  );
}
