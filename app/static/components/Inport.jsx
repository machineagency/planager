import React from "react";

export default function Inport({
  inportName,
  displayName,
  reference,
  endConnection,
  description,
  contents,
}) {
  return (
    <div className='leftPortWrapper'>
      <div
        ref={reference}
        key={inportName}
        title={displayName}
        className='port leftPort'
        onClick={endConnection}>
        <div className='portName'>{displayName}</div>
      </div>
    </div>
  );
}
