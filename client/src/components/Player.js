import React, { useEffect, useRef } from "react";

const Player = ({ player, muted }) => {
  // const [videoTracks, setVideoTracks] = useState([]);
  // const [audioTracks, setAudioTracks] = useState([]);

  // const videoRef = useRef();
  // const audioRef = useRef();

  // const trackpubsToTracks = (trackMap) =>
  //   Array.from(trackMap.values())
  //     .map((publication) => publication.track)
  //     .filter((track) => track !== null);

  // useEffect(() => {
  //   const trackSubscribed = (track) => {
  //     if (track.kind === "video") {
  //       setVideoTracks((videoTracks) => [...videoTracks, track]);
  //     } else {
  //       setAudioTracks((audioTracks) => [...audioTracks, track]);
  //     }
  //   };

  //   const trackUnsubscribed = (track) => {
  //     if (track.kind === "video") {
  //       setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
  //     } else {
  //       setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
  //     }
  //   };

  //   setVideoTracks(trackpubsToTracks(player.videoTracks));
  //   setAudioTracks(trackpubsToTracks(player.audioTracks));

  //   player.on("trackSubscribed", trackSubscribed);
  //   player.on("trackUnsubscribed", trackUnsubscribed);

  //   return () => {
  //     setVideoTracks([]);
  //     setAudioTracks([]);
  //     player.removeAllListeners();
  //   };
  // }, [player]);

  // useEffect(() => {
  //   const videoTrack = videoTracks[0];
  //   if (videoTrack) {
  //     videoTrack.attach(videoRef.current);
  //     return () => {
  //       videoTrack.detach();
  //     };
  //   }
  // }, [videoTracks]);

  // useEffect(() => {
  //   const audioTrack = audioTracks[0];
  //   if (audioTrack) {
  //     audioTrack.attach(audioRef.current);
  //     return () => {
  //       audioTrack.detach();
  //     };
  //   }
  // }, [audioTracks]);

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
