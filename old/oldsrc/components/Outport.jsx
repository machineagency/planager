import React from "react";

export default function Outport({
  outportName,
  displayName,
  reference,
  beginConnection,
  description,
  contents,
}) {
  return (
    <div className='rightPortWrapper'>
      <div
        ref={reference}
        key={outportName}
        title={displayName}
        className='port rightPort'
        onClick={beginConnection}>
        <div className='portName'>{displayName}</div>
      </div>
    </div>
  );
}
