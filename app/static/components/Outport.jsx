import React from "react";

export default function Outport({
  outportName,
  displayName,
  reference,
  beginConnection,
}) {
  return (
    <div
      ref={reference}
      key={outportName}
      title={displayName}
      className='port rightPort'
      onClick={beginConnection}
    />
  );
}
