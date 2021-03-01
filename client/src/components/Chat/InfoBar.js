import React from 'react';
import './InfoBar.css';

const InfoBar = ({ room }) => (
  <div className="infobar">
    <h3 className="infobar-roomcode">{room}</h3>
  </div>
);

export default InfoBar;
