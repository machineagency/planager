import React, { useState, useEffect } from "react";

import "./Slider.css";

export default function Slider({ action, sendToOutport }) {
  const [val, setVal] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(15);

  useEffect(() => {
    sendToOutport(action.id, { val: val });
  }, []);

  function send() {
    console.log("sending");
    sendToOutport(action.id, { val: val });
  }

  return (
    <div>
      <div className='slidecontainer'>
        <input
          type='range'
          min={min}
          max={max}
          value={val}
          className='slider'
          onChange={(e) => setVal(e.target.value)}
          onMouseUp={send}
        />
      </div>
      <div>Value: {val}</div>
    </div>
  );
}
