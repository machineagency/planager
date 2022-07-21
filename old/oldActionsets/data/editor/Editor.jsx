import React, { useState, useEffect } from "react";
import { Controlled as CodeMirrorComponent } from "react-codemirror2";

import "codemirror/mode/python/python";
import "codemirror/mode/javascript/javascript";

import "./Editor.css";

function EditName({ action, initialName, runBackendMethod, varID }) {
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  function recordName() {
    runBackendMethod(action.id, "updateVarName", { id: varID, newName: name });
    setEditing(false);
  }
  function checkKey(e) {
    if (e.key === "Enter") recordName();
  }
  return (
    <div>
      {editing && (
        <input
          className='nameEdit'
          type='text'
          onKeyDown={checkKey}
          onBlur={recordName}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      {!editing && <div onClick={() => setEditing(true)}>{initialName}</div>}
    </div>
  );
}

function VariableList({ action, vars, runBackendMethod }) {
  const [formatted, setFormatted] = useState([]);
  useEffect(() => {
    let newVars = [];
    Object.entries(vars).map(([k, v]) => {
      let varInfo = {};
      [varInfo.actionID, varInfo.portID] = k.split("_");
      varInfo.value = v.val;
      varInfo.name = v.name;
      varInfo.id = k;
      newVars.push(varInfo);
    });
    setFormatted(newVars);
  }, [vars]);
  return (
    <div className='varsContainer'>
      <div className='header cell action'>Action ID</div>
      <div className='header cell portID'>Port Name</div>
      <div className='header cell value'>Current Value</div>
      <div className='header cell name'>Re-Name</div>
      {formatted.map((data) => (
        <>
          <div className='cell action' key={data.id + "action"}>
            {"{...}"}
          </div>
          <div className='cell portID' key={data.id + "portID"}>
            {data.portID}
          </div>
          <div className='cell value' key={data.id + "value"}>
            {data.value}
          </div>
          <EditName
            key={data.id + "name"}
            className='cell name'
            initialName={data.name}
            runBackendMethod={runBackendMethod}
            varID={data.id}
            action={action}
          />
        </>
      ))}
    </div>
  );
}

export default function Editor({ action, runBackendMethod }) {
  const [text, setText] = useState(action.state.text);
  function updateText(txt) {
    setText(txt);
    runBackendMethod(action.id, "save", txt);
  }
  return (
    <div>
      <VariableList
        vars={action.state.varMap}
        runBackendMethod={runBackendMethod}
        action={action}
      />
      <div id='editorContainer'>
        <CodeMirrorComponent
          className='editor'
          value={text}
          options={{ mode: action.state.mode, theme: "solarized dark" }}
          onBeforeChange={(editor, data, value) => {
            updateText(value);
          }}
          onChange={(editor, data, value) => updateText(value)}
        />
      </div>
      {action.state.eval}
    </div>
  );
}
