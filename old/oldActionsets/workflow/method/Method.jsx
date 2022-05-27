import React from "react";
import { useState } from "react";

import "./Method.css";

function EditPortNameDialog({ after, msg }) {
  const [portName, setPortName] = useState("");
  function shouldExit(e) {
    if (e.key !== "Enter") return;
    after(portName);
  }
  return (
    <div className='portNameModal'>
      <div className='modalContent'>
        <div>{msg}</div>
        <input
          className='nameInput'
          type='text'
          value={portName}
          onChange={(e) => setPortName(e.target.value)}
          onKeyPress={shouldExit}
        />
      </div>
    </div>
  );
}

export default function Method({ action, sendToOutport, runBackendMethod }) {
  const [method, setMethod] = useState("lorem ipsum dolor sit amet");
  const [showInportName, setShowInportName] = useState(false);
  const [showOutportName, setShowOutportName] = useState(false);
  function renderInputs() {
    return Object.entries(action.inports).map(([key, value]) => {
      return (
        <div key={key}>
          <div>
            <b>{key}</b>
          </div>
          <div className='tagContainer'>
            {Object.values(value.value).map((val, index) => {
              return (
                <div
                  className={val ? "tag dataTag" : "tag nullTag"}
                  key={index}>
                  {val ? val : "null"}
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }
  function renderOutputs() {
    return Object.entries(action.outports).map(([key, value]) => {
      return (
        <div key={key}>
          <div>
            <b>{key}</b>
          </div>
          <div className='tagContainer'>
            {/*Object.values(value.value).map((val, index) => {
              return (
                <div
                  className={val ? "tag dataTag" : "tag nullTag"}
                  key={index}>
                  {val ? val : "null"}
                </div>
              );
            })*/}
          </div>
        </div>
      );
    });
  }
  function addInport(newInportName) {
    setShowInportName(false);
    runBackendMethod(action.id, "createNewInport", {
      newInportName: newInportName,
    });
  }
  function addOutport(newOutportName) {
    setShowOutportName(false);
    runBackendMethod(action.id, "createNewOutport", {
      newOutportName: newOutportName,
    });
  }
  return (
    <div className='methodContainer'>
      {showInportName && (
        <EditPortNameDialog after={addInport} msg={"new inport name:"} />
      )}
      {showOutportName && (
        <EditPortNameDialog after={addOutport} msg={"new outport name:"} />
      )}

      <div>
        <div className='methodHeading'>
          <span>Inports</span>
          <span className='addButton' onClick={() => setShowInportName(true)}>
            +
          </span>
        </div>
        {renderInputs()}
      </div>
      <div>
        <div className='methodHeading'>
          <span>Outports</span>
          <span className='addButton' onClick={() => setShowOutportName(true)}>
            +
          </span>
        </div>
        {renderOutputs()}
      </div>
      <div>
        <div className='methodHeading'>Method</div>
        <textarea
          className='methodInput'
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />
      </div>
    </div>
  );
}
