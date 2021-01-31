import React from "react";
import "./ChatTextfield.css";

const ChatTextfield = ({ setMessage, sendMessage, message }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Make a guess ..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={(e) =>
        e.key === "Enter" ? sendMessage(e) : null
      }
    />
    <button className="sendButton" onClick={(e) => sendMessage(e)}>
      <p>SEND</p>
    </button>
  </form>
);

export default ChatTextfield;
