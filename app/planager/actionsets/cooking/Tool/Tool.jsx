import React from "react";
import { useState } from "react";

import "./Tool.css";

export default function Tool({ action, sendToOutport }) {
  const [tool, setTool] = useState("");
  return (
    <div className='background'>
      <input
        type='text'
        value={tool}
        onChange={(e) => {
          setIngredient(
            e.target.value,
            sendToOutport(action.id, { tool: tool })
          );
        }}
      />
    </div>
  );
}
