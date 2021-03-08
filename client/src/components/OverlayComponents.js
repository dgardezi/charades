import React from "react";
import "./OverlayComponents.css";

export const OverlayMessage = ({ message }) => {
  return <p className="overlay-message">{message}</p>;
};

export const WordChoices = ({ words, onWordChoice }) => {
  const buttons = words.map((word) => (
    <button
      key={word}
      className="word-choice-button"
      onClick={() => onWordChoice(word)}
    >
      <p> {word} </p>
    </button>
  ));

  return <div className="word-choice-buttons">{buttons}</div>;
};
