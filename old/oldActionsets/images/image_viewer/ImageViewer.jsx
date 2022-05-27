import React from "react";

import "./ImageViewer.css";

export default function ImageViewer({ action, runBackendMethod }) {
  return (
    <div className='resizable'>
      <img
        id='imageView'
        src={action.inports.imIn.value ? action.inports.imIn.value : null}
      />
    </div>
  );
}
