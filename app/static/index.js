import React from "react";
import ReactDOM from "react-dom";
import { SocketContext, socket } from "./context/socket";
import Workspace from "./components/Workspace";

ReactDOM.render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <Workspace />
    </SocketContext.Provider>
  </React.StrictMode>,
  document.getElementById("react-root")
);
