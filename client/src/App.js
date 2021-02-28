import React, { useState, useCallback, useEffect, useContext } from "react";
import Peer from "peerjs";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import { GameContext } from "./GameContext";

import { socket } from "./Socket";

const PEER_OPTIONS = {
  host: "localhost",
  port: "9000",
  path: "video",
  debug: 3,
};

const App = () => {
  const gameContext = useContext(GameContext);

  const addPlayer = (userId, username, stream, call) => {
    console.log("adding player", gameContext.players);
    gameContext.setPlayers((prevplayers) => [
      ...prevplayers,
      {
        userId: userId,
        username: username,
        stream: stream,
        call: call,
        volume: 0.5,
      },
    ]);
  };

  const connectToNewUser = (userId, username, stream) => {
    console.log(
      `connecting to ${userId}, ${username} at ${new Date().getTime()}`
    );
    const call = gameContext.myPeer.call(userId, stream, {
      metadata: { username: gameContext.name },
    });

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
    if (socket.id) {
      //console.log(socket.id);
      console.log(socket.id, Date.now());
      gameContext.setMyPeer(new Peer(socket.id, PEER_OPTIONS));
    }
  }, [socket]);

  useEffect(() => {
    if (gameContext.myPeer) {
      gameContext.myPeer.on("error", (err) => {
        console.log(err.type, err);
      });
    }
  }, [gameContext.myPeer]);

  useEffect(() => {
    socket.on("joinRoomResponse", ({ response, room }) => {
      const { status, message } = response;
      console.log("Success:", response);
      if (status === 0) {
        gameContext.setRoom(room);
        gameContext.setState("lobby");
      } else {
        alert(message);
      }
    });

    socket.on("startGameResponse", ({ response }) => {
      const { status, message } = response;
      console.log("Success:", response);
      if (status === 0) {
        gameContext.setState("game");
      } else {
        alert(message);
      }
    });

    socket.on("userDisconnected", ({ userId }) => {
      console.log(`Removing user ${userId}`);

      // Close connection to user
      var dcUser = gameContext.players.find(
        (player) => player.userId === userId
      );
      if (dcUser) {
        dcUser.call.close();
      }

      // Remove user from players
      gameContext.setPlayers((prevPlayers) =>
        prevPlayers.filter((p) => p.userId !== userId)
      );
    });
  }, []);

  useEffect(() => {
    const setupConnections = async (stream) => {
      // Setup socket to answer calls and share stream from other users
      console.log("setting up answering machine", new Date().getTime());
      await gameContext.myPeer.on("call", (call) => {
        const userId = call.peer;
        const username = call.metadata.username;
        console.log(
          `receiving call from ${username} at ${new Date().getTime()}`
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
            addPlayer(userId, username, userVideoStream, call);
          }
        });
      });

      // Setup listener that calls new user when they connect
      socket.on("userConnected", (userId, username) => {
        connectToNewUser(userId, username, stream);
      });
    };

    if (gameContext.state === "lobby") {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          // Add client stream to players
          addPlayer(socket.id, gameContext.name, stream, null);

          // After all connections are made, let server know to let other users in room know.
          setupConnections(stream).then(() => {
            console.log("connecting to other users");
            socket.emit("userConnected", gameContext.room);
          });
        });
    }
  }, [gameContext.state]);

  let render;
  if (gameContext.state === "home") {
    render = <Home />;
  } else if (gameContext.state === "lobby") {
    render = <Lobby />;
  } else {
    render = <Game />;
  }

  return render;
};

export default App;
