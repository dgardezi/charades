import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import MobileLanding from "./MobileLanding";
import "./index.css";
import { GameProvider } from "./GameContext";
import { BrowserView, MobileView } from "react-device-detect";

ReactDOM.render(
  <GameProvider>
    <BrowserView>
      <App />
    </BrowserView>
    <MobileView>
      <MobileLanding />
    </MobileView>
  </GameProvider>,
  document.getElementById("root")
);
