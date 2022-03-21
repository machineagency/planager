import React, { useState, useEffect } from "react";

import "./Toggle.css";

export default function Toggle({ action, sendToOutport }) {
  const [toggle, setToggle] = useState("");
  useEffect(() => {
    sendToOutport(action.id, { toggle: toggle });
  }, [toggle]);

  return (
    <div>
      <input
        type='checkbox'
        id='switch'
        className='checkbox'
        onClick={(val) => setToggle(val.target.checked)}
      />
      <label htmlFor='switch' className='toggle'></label>
    </div>
  );
}
