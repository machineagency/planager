import React from "react";

import "./RecordArray.css";

export default function RecordArray({ action, runBackendMethod }) {
  return (
    <div>
      <input
        type='number'
        value={action.state.length}
        onChange={(e) =>
          runBackendMethod(action.id, "updateLength", e.target.value)
        }></input>
      <div>
        {action.state.current.map((val) => {
          return `${val},`;
        })}
      </div>
    </div>
  );
}
