import React from "react";
import send_icon from "../../resources/icons/send-button.svg";
import "./ChatTextfield.css";

const ChatTextfield = ({ setMessage, sendMessage, message }) => (
  <form className="chat-input">
    <input
      className="text-input"
      type="text"
      placeholder="make a guess . . ."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={(e) =>
        e.key === "Enter" ? sendMessage(e) : null
      }
    />
    <img src={send_icon} className="send-button" onClick={(e) => sendMessage(e)} />
  </form>
);

export default ChatTextfield;
