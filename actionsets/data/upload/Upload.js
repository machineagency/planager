import { LitElement, html, css } from "lit";
import { DataController } from "../../../src/controllers/DataController";

export default class Upload extends LitElement {
  dat = new DataController(this);

  static styles = css`
    input[type="file"] {
      display: none;
    }

    .uploadButton {
      border: none;
      display: inline-block;
      padding: 6px;
      cursor: pointer;
      font-family: inherit;
      width: 100%;
      background-color: var(--violet);
      color: var(--base3);
    }

    .fileInfoContainer {
      padding: 0.5rem;
    }
  `;

  parseFile(e) {
    setFileContents(e.target.result);
  }

  loadError(e) {
    alert("Error loading file!");
  }

  uploadFile(e) {
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

  render() {
    return html`
      <div>
        <label className="uploadButton">
          <input type="file" @change=${this.uploadFile} />
          ${fileName ? "Upload different file" : "Upload a file"}
        </label>
        <!-- <FileInfo
          fileName="{fileName}"
          fileType="{fileType}"
          fileSize="{fileSize}"
          lastModified="{lastModified}"
        /> -->
      </div>
    `;
  }
}
