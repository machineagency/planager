import React from "react";
import PortHover from "./PortHover";

export default function Outport({
  outportName,
  displayName,
  reference,
  beginConnection,
  description,
  contents,
}) {
  return (
    <div className='portWrapper'>
      <div
        ref={reference}
        key={outportName}
        title={displayName}
        className='port rightPort'
        onClick={beginConnection}></div>
      <PortHover
        portName={displayName}
        description={description}
        contents={contents}
      />
    </div>
  );
}
