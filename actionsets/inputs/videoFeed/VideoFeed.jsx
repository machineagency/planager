import React, { useState, useEffect, useRef } from "react";
import "./VideoFeed.css";

export default function VideoFeed({ action, sendToOutport, runBackendMethod }) {
  const videoRef = useRef();
  useEffect(() => {
    if (!action.inports.video.value) return;

    navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: action.inports.video.value },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });
  });
  return (
    <div>
      <video autoPlay ref={videoRef}></video>
    </div>
  );
}
