import React from "react";
import "./Message.css";

const Message = ({ message: { user, text }, name }) =>
  user === name ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{name}</p>
      <div className="messageBox backgroundPink">
        <p className="messageText">{text}</p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundGray">
        <p className="messageText textBlack">{text}</p>
      </div>
      <p className="sentText pl-10 ">{user}</p>
    </div>
  );

export default Message;
