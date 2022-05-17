import React, { useState, useEffect } from "react";

import "./Upload.css";

function FileInfo({ fileName, fileType, fileSize, lastModified }) {
  return (
    <div className='fileInfoContainer'>
      <div>
        <b>Filename:</b> {fileName ? fileName : "none"}
      </div>
      <div>
        <b>Type:</b> {fileType ? fileType : "none"}
      </div>
      <div>
        <b>Size:</b> {fileSize ? fileSize : "none"}
      </div>
      <div>
        <b>Modified:</b>{" "}
        {lastModified
          ? new Date(lastModified).toLocaleDateString("en-US")
          : "none"}
      </div>
    </div>
  );
}

export default function Upload({ action, sendToOutport }) {
  const [fileType, setFileType] = useState();
  const [fileContents, setFileContents] = useState();
  const [fileName, setFileName] = useState();
  const [lastModified, setLastModified] = useState();
  const [fileSize, setFileSize] = useState();

  useEffect(() => {
    sendToOutport(action.id, {
      fileContents: fileContents,
      fileName: fileName,
      lastModified: lastModified,
      fileSize: fileSize,
      fileType: fileType,
    });
  }, [fileType, fileContents, fileName, lastModified, fileSize]);

  function parseFile(e) {
    setFileContents(e.target.result);
  }

  function loadError(e) {
    alert("Error loading file!");
  }

  function uploadFile(e) {
    const reader = new FileReader();
    reader.onload = parseFile;
    reader.onerror = loadError;

    const file = e.target.files[0];
    setFileName(file.name);
    setFileType(file.type);
    setFileSize(file.size);
    setLastModified(file.lastModified);
    reader.readAsText(file);
  }

  return (
    <div>
      <label className='uploadButton'>
        <input type='file' onChange={uploadFile} />
        {fileName ? "Upload different file" : "Upload a file"}
      </label>
      <FileInfo
        fileName={fileName}
        fileType={fileType}
        fileSize={fileSize}
        lastModified={lastModified}
      />
    </div>
  );
}
