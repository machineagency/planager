import React, { useState, useEffect } from "react";

import "./Text.css";

export default function Text({ action, runBackendMethod }) {
  const [text, setText] = useState(action.state.textValue);
  useEffect(() => {
    runBackendMethod(action.id, "updateText", text);
  }, [text]);

  return (
    <div className='background'>
      <input
        className='textInput'
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
