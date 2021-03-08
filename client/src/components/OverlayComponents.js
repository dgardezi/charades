import React from "react";
import "./OverlayComponents.css";

const WordChoices = ({ words, onWordChoice }) => {
  console.log(words);
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

export default WordChoices;
