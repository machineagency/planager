import React from "react";
import ReactDOM from "react-dom";
import { SocketContext, socket } from "./context/socket";
import Workspace from "./components/Workspace";

ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <Workspace />
  </SocketContext.Provider>,
  document.getElementById("react-root")
);
