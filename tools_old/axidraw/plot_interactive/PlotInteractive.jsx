import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../../src/context/socket";

import "./PlotInteractive.css";

export default function PlotInteractive({
  action,
  sendToOutport,
  runBackendMethod,
}) {
  const socks = useContext(SocketContext);
  function connect() {
    // let socket = this.context;
    socks.emit("runBackendMethod", {
      method: "connect",
      actionID: action.id,
      args: {},
    });
  }
  return (
    <div>
      <button onClick={connect}>Connect</button>
    </div>
  );
}
