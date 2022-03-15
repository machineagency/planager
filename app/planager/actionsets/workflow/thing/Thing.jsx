import React from "react";
import { useState, useEffect } from "react";

import "./Thing.css";

export default function Thing({ action, sendToOutport }) {
  const [name, setName] = useState("");
  useEffect(() => {
    sendToOutport(action.id, { thingName: name });
  }, [name]);

  return (
    <div className='background'>
      <input
        className='thingInput'
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
