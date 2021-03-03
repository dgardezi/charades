import React from "react";
import "./MobileLanding.css";

import ErrorIcon from "./resources/images/error.svg";

const MobileLanding = () => {
  return (
    <div className="mobile-landing-container">
      <img className="error-icon" src={ErrorIcon} />
      <p className="message">Sorry, please join on a computer to play!</p>
    </div>
  );
};

export default MobileLanding;
