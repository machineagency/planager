import React from "react";

export default function ActionConfig({ removeAction, configStatus }) {
  return (
    <div
      id='configContainer'
      style={{ display: configStatus ? "block" : "none" }}>
      <div id='config'>
        <div id='removeActionButton' type='button' onClick={removeAction}>
          Remove Action
        </div>
      </div>
    </div>
  );
}
