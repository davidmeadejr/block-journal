import * as React from "react";
import { ethers } from "ethers";
import "./App.css";

export default function App() {
  const wave = () => {};

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">⛓️📝 Block Journal</div>

        <div className="bio">
          Promoting good habits through daily journalling on the blockchain. For a chance to win free ETH. 🦇🔊
        </div>

        <button className="waveButton" onClick={wave}>
          Journal 📝
        </button>
      </div>
    </div>
  );
}
