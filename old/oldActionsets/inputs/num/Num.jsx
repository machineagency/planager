import React from "react";

import "./Num.css";

export default function Num({ action, runBackendMethod }) {
  return (
    <div>
      <input
        className='numberInput'
        type='number'
        value={action.state.number}
        onChange={(e) =>
          runBackendMethod(action.id, "updateNumber", e.target.value)
        }
      />
    </div>
  );
}
