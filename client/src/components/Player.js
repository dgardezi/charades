import React, { useEffect, useRef } from "react";

const Player = ({ player, muted }) => {
  const userVideo = useRef();

  useEffect(() => {
    if (userVideo.current) {
      userVideo.current.srcObject = player.stream;
    }
  }, [player.stream]);

  return (
    <div className="player">
      <h3>{player.username}</h3>
      <video ref={userVideo} autoPlay={true} muted={muted} />
    </div>
  );
};

export default Player;
