import React, { useState, useEffect } from "react";
// import queryString from "query-string";
// import io from "socket.io-client";

import Messages from "./Messages";
import InfoBar from "./InfoBar";
import ChatTextfield from "./ChatTextfield";
import "./ChatBox.css";

// const ENDPOINT = "http://localhost:3001/";

// let socket;

const ChatBox = ({ room, name }) => {
  // const [name, setName] = useState("");
  // const [room, setRoom] = useState("");
  // const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   const { name, room } = queryString.parse(location.search);

  //   socket = io(ENDPOINT);

  //   setRoom(room);
  //   setName(name);

  //   socket.emit("join", { name, room }, (error) => {
  //     if (error) {
  //       alert(error);
  //     }
  //   });
  // }, [ENDPOINT, location.search]);

  // useEffect(() => {
  //   socket.on("message", (message) => {
  //     setMessages((messages) => [...messages, message]);
  //   });

  //   socket.on("roomData", ({ users }) => {
  //     setUsers(users);
  //   });
  // }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    // if (message) {
    //   socket.emit("sendMessage", message, () => setMessage(""));
    // }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <ChatTextfield
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatBox;
