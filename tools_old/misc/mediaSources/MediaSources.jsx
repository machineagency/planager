import React, { useState, useEffect } from "react";
import "./MediaSources.css";

export default function MediaSources({
  action,
  sendToOutport,
  runBackendMethod,
}) {
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedVideo, selectVideo] = useState(null);
  const [selectedAudio, selectAudio] = useState(null);

  useEffect(() => {
    // Get the currently available media devices and store them in state variables
    let aud = [];
    let vid = [];
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      devices.forEach(function (device) {
        if (device.kind === "audioinput") {
          aud.push(device);
        }
        if (device.kind === "videoinput") {
          vid.push(device);
        }
      });
    });
    setVideoDevices(vid);
    setAudioDevices(aud);
  }, []);

  function setSelectedAudio(deviceID) {
    selectAudio(deviceID);
    sendToOutport(action.id, { audio: deviceID });
  }

  function setSelectedVideo(deviceID) {
    selectVideo(deviceID);
    sendToOutport(action.id, { video: deviceID });
  }

  return (
    <div>
      <div className='heading'>audio inputs</div>
      {audioDevices.map((device, index) => {
        return (
          <div
            key={index}
            className={`audio input${
              selectedAudio == device.deviceId ? " selected" : ""
            }`}
            onClick={() => setSelectedAudio(device.deviceId)}>
            {device.label}
          </div>
        );
      })}
      <div className='heading'>video inputs</div>
      {videoDevices.map((device, index) => {
        return (
          <div
            key={index}
            className={`video input${
              selectedVideo == device.deviceId ? " selected" : ""
            }`}
            onClick={() => setSelectedVideo(device.deviceId)}>
            {device.label}
          </div>
        );
      })}
    </div>
  );
}
