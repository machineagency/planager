import React, { useState, useEffect, useRef } from "react";
import "./AudioFeed.css";

function Status({ recording, deviceID }) {
  const [deviceName, setDeviceName] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      devices.forEach(function (device) {
        if (device.deviceId === deviceID) {
          setDeviceName(device.label);
        }
      });
    });
    if (recording) {
      setStatusMessage("Recording in progress on ");
    } else {
      if (deviceID) {
        setStatusMessage("Ready to record on ");
      } else {
        setStatusMessage("No device input selected!");
      }
    }
  }, [deviceID, recording]);

  return (
    <div className='status'>
      <b>Status:</b>
      {statusMessage}
      {deviceName}
    </div>
  );
}

export default function AudioFeed({ action, sendToOutport, runBackendMethod }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [audioURL, setAudioURL] = useState(null);

  useEffect(() => {
    if (!action.inports.audioDevice.value) return;

    navigator.mediaDevices
      .getUserMedia({
        audio: { deviceId: action.inports.audioDevice.value },
      })
      .then((stream) => {
        const rec = new MediaRecorder(stream);
        setMediaRecorder(rec);
      });
  }, [action.inports.audioDevice.value]);

  useEffect(() => {
    // This only runs when chunks changes. Turns the chunks from the audio
    // recording into a blob into an objectURL that can be given to the audio tag
    if (!chunks.length) return;
    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    const audioURL = window.URL.createObjectURL(blob);
    setAudioURL(audioURL);
  }, [chunks]);

  function startRecording() {
    setRecording(true);
    mediaRecorder.ondataavailable = onDataAvailable;
    mediaRecorder.start();
  }

  function stopRecording() {
    setRecording(false);
    mediaRecorder.stop();
  }

  function onDataAvailable(e) {
    setChunks((arr) => [...arr, e.data]);
  }

  return (
    <div>
      <Status
        deviceID={action.inports.audioDevice.value}
        recording={recording}
      />
      {recording ? (
        <div className='recordButton' type='button' onClick={stopRecording}>
          Stop
        </div>
      ) : (
        <div className='recordButton' type='button' onClick={startRecording}>
          Record
        </div>
      )}
      {audioURL && <audio controls autoPlay src={audioURL}></audio>}
    </div>
  );
}
