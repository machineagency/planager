import React, { useState, useEffect } from "react";

import "./Gate.css";

export default function Gate({ action, runBackendMethod }) {
  return (
    <div
      className={`gate ${action.state.open ? "open" : "closed"}`}
      onClick={() =>
        runBackendMethod(action.id, "setGate", !action.state.open)
      }>
      {action.state.open ? "OPEN" : "CLOSED"}
    </div>
  );
}
