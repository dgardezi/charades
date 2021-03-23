import React from "react";
import "./Message.css";

const Message = ({ message: { user, text }, name }) => {
  let render;

  if (user === name) {
    render = (
      <div className="messageContainer justifyEnd">
        <p className="sentText pr-10">{name}</p>
        <div className="messageBox backgroundPink">
          <p className="messageText">{text}</p>
        </div>
      </div>
    );
  } else if (user === "") {
    render = (
      <div className="messageContainer justifyStart">
        <div className="messageBox backgroundAqua">
          <p className="messageText textBlack">{text}</p>
        </div>
      </div>
    );
  } else {
    render = (
      <div className="messageContainer justifyStart">
        <div className="messageBox backgroundGray">
          <p className="messageText textBlack">{text}</p>
        </div>
        <p className="sentText pl-10 ">{user}</p>
      </div>
    );
  }

  return render;
};

export default Message;
