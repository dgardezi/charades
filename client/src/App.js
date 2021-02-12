import React, { useState, useCallback, useEffect } from "react";
import Peer from "peerjs";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Game from "./components/Game";

import { socket } from "./Socket";

const PEER_OPTIONS = { host: "localhost", port: "9000", path: "video" };

const App = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [players, setPlayers] = useState([]); // player = {userId, username, stream, call}
  const [state, setState] = useState("home");
  const [myPeer, setMyPeer] = useState(null);

  const handleNameChange = useCallback((event) => {
    setName(event.target.value);
  }, []);

  const handleRoomChange = useCallback((event) => {
    setRoom(event.target.value.trim().toUpperCase());
  }, []);

  const addPlayer = (userId, username, stream, call) => {
    console.log("adding player", players);
    setPlayers((prevplayers) => [
      ...prevplayers,
      {
        userId: userId,
        username: username,
        stream: stream,
        call: call,
      },
    ]);
  };

  const connectToNewUser = (userId, username, stream) => {
    console.log(`connecting to ${username} at ${new Date().getTime()}`);
    const call = myPeer.call(userId, stream);

    console.log(`setting up stream for response ${new Date().getTime()}`);
    let count = 0;
    call.on("stream", (userVideoStream) => {
      if (count++ % 2 === 0) {
        console.log(
          `receiving stream from ${username} at ${new Date().getTime()}`
        );
        addPlayer(userId, username, userVideoStream, call);
      }
    });
  };

  useEffect(() => {
    // Setup peer on startup
    setMyPeer(new Peer(socket.id, PEER_OPTIONS));
  }, []);

  useEffect(() => {
    if (myPeer) {
      socket.on("joinRoomResponse", ({ response, room }) => {
        const { status, message } = response;
        console.log("Success:", response);
        if (status === 0) {
          setRoom(room);
          setState("lobby");
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

      socket.on("userDisconnected", ({ username }) => {
        console.log(`Removing user ${username}`);

        // Close connection to user
        var dcUser = players.find((player) => player.username === username);
        if (dcUser) {
          dcUser.call.close();
        }

        // Remove user from plays
        setPlayers((prevPlayers) =>
          prevPlayers.filter((p) => p.username !== username)
        );
      });
    }
  }, [myPeer]);

  useEffect(() => {
    if (state === "lobby") {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          // audio: true,
        })
        .then((stream) => {
          // Add client stream to players
          addPlayer(socket.id, name, stream, null);

          // Setup socket to answer calls and share stream from other users
          console.log("setting up answering machine", new Date().getTime());
          myPeer.on("call", (call) => {
            var userId = call.peer;
            console.log(
              `receiving call from ${userId} at ${new Date().getTime()}`
            );
            call.answer(stream);

            // Wait to receive the users stream
            console.log("setting up stream answer once");
            let count = 0;
            call.on("stream", (userVideoStream) => {
              if (count++ % 2 === 0) {
                console.log(
                  `receiving stream from ${userId} at ${new Date().getTime()}`
                );
                // Get the username of the incoming caller
                socket.emit("usernameQuery", userId);

                // Wait for response of incoming username and then add player to players
                socket.once("usernameResponse", (username) => {
                  console.log(`Username of ${userId} is ${username}`);
                  addPlayer(userId, username, userVideoStream, call);
                });
              }
            });
          });

          // Setup listener that calls new user when they connect
          socket.on("userConnected", (userId, username) => {
            connectToNewUser(userId, username, stream);
          });

          // After all connections are made, let server know to let other users in room know.
          socket.emit("userConnected", room);
        });
    }
  }, [state]);

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
    render = <Lobby room={room} players={players} />;
  } else {
    render = <Game room={room} name={name} players={players} />;
  }

  return render;
};

export default App;
