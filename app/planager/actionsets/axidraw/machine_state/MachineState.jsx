import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../../../static/context/socket";

import "./MachineState.css";

export default function MachineState({
  action,
  sendToOutport,
  runBackendMethod,
}) {
  const socket = useContext(SocketContext);
  const [machineState, setMachineState] = useState({});
  function refresh() {
    socket.emit(
      "runBackendMethod",
      {
        method: "refresh",
        actionID: action.id,
        args: {},
      },
      (res) => console.log(res)
    );
  }
  return (
    <div>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
