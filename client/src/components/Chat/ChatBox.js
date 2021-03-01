import React, { useState, useEffect } from "react";

import Messages from "./Messages";
import InfoBar from "./InfoBar";
import ChatTextfield from "./ChatTextfield";
import { socket } from "../../Socket";
import "./ChatBox.css";

const ChatBox = ({ room, name }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (message) => {
      console.log("receiving message:", message);
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      console.log("attempting to send", message);
      socket.emit("sendMessage", { message: message });
      setMessage("");
    }
  };

  return (
    <div className="chatbox">
      <InfoBar room={room} />
      <Messages messages={messages} name={name} />
      <ChatTextfield
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </div>
  );
};

export default ChatBox;
