import React from "react";
import ReactJson from "react-json-view";

export default function PortHover({ portName, description, contents }) {
  return (
    <div className='portHoverDialog'>
      <span>{portName}</span>
      <br />
      <span>{description ? description : ""}</span>
      <ReactJson
        src={contents ? contents : ["no data!"]}
        theme='solarized'
        name={false}
        enableClipboard={false}
        collapsed={1}
      />
    </div>
  );
}
