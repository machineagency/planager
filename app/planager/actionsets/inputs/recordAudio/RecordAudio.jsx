import React, { useState, useEffect } from "react";

import "./RecordAudio.css";

export default function RecordAudio({
  action,
  sendToOutport,
  runBackendMethod,
}) {
  const [text, setText] = useState("");
  useEffect(() => {
    sendToOutport(action.id, { text: text });
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
