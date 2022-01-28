import React from "react";

export default function Inport({
  inportName,
  displayName,
  reference,
  endConnection,
}) {
  return (
    <div
      ref={reference}
      key={inportName}
      title={displayName}
      className='port leftPort'
      onClick={endConnection}
    />
  );
}
