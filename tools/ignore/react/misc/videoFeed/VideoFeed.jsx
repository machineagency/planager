import React, { useEffect, useRef } from "react";
import "./VideoFeed.css";

export default function VideoFeed({ action, runBackendMethod }) {
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

  function getScreenshot(videoEl) {
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.clientWidth;
    canvas.height = videoEl.clientHeight;
    canvas
      .getContext("2d")
      .drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    runBackendMethod(action.id, "takeSnapshot", canvas.toDataURL());
  }
  return (
    <div>
      <video autoPlay ref={videoRef} height='300px'></video>
      <div onClick={() => getScreenshot(videoRef.current)}>Take Screenshot</div>
    </div>
  );
}
