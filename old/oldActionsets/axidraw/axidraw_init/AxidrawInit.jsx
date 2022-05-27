import React, { useState, useContext } from "react";
import { SocketContext } from "../../../src/context/socket";
import "./AxidrawInit.css";

export default function AxidrawInit({
  action,
  sendToOutport,
  runBackendMethod,
}) {
  const socks = useContext(SocketContext);
  const [connected, setConnected] = useState(false);
  const [coords, setCoords] = useState({ x: null, y: null });
  const [penUp, setPenUp] = useState(null);
  function connect() {
    socks.emit(
      "runBackendMethod",
      {
        method: "connect",
        actionID: action.id,
        args: {},
      },
      (res) => setConnected(res.data.connected)
    );
  }
  function disconnect() {
    socks.emit(
      "runBackendMethod",
      {
        method: "disconnect",
        actionID: action.id,
        args: {},
      },
      (res) => setConnected(res.data.connected)
    );
  }
  return (
    <div>
      {!connected && <button onClick={connect}>Connect</button>}
      {connected && <button onClick={disconnect}>Disconnect</button>}
      <div>Status: {connected ? "connected" : "not connected"}</div>
      <div>Coords: {connected ? `X: ${coords.x}, Y: ${coords.y}` : ""}</div>
      <div>Pen: {connected ? `up: ${penUp}` : ""}</div>
    </div>
  );
}
