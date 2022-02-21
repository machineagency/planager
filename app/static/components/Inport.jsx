import React from "react";
import PortHover from "./PortHover";

export default function Inport({
  inportName,
  displayName,
  reference,
  endConnection,
  description,
  contents,
}) {
  return (
    <div
      ref={reference}
      key={inportName}
      title={displayName}
      className='port leftPort'
      onClick={endConnection}>
      <PortHover
        portName={displayName}
        description={description}
        contents={contents}
      />
    </div>
  );
}
