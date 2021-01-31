import React, { useState, useEffect } from "react";
// import queryString from "query-string";
// import io from "socket.io-client";

import Messages from "./Messages";
import InfoBar from "./InfoBar";
import ChatTextfield from "./ChatTextfield";
import { socket } from "../../Socket";
import "./ChatBox.css";

// const ENDPOINT = "http://localhost:3001/";

// let socket;

const ChatBox = ({ room, name }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
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
