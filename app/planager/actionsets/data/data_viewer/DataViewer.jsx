import React, { useState } from "react";
import ReactJson from "react-json-view";
import "./DataViewer.css";

export default function DataViewer({ action }) {
  const [collapsed, setCollapsed] = useState(1);
  const [dataTypes, setDataTypes] = useState(true);

  function chooseSrc(val) {
    if (!val) return { msg: null };
    if (typeof val === "object") return val;
    return { data: val };
  }

  return (
    <div id='dataViewerUI'>
      <ReactJson
        theme='solarized'
        name={false}
        src={chooseSrc(action.inports.data.value)}
        collapsed={collapsed}
        dataTypes={dataTypes}
        enableClipboard={false}
      />
    </div>
  );
}
