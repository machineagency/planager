import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";

export default class PlanagerDownload extends LitElement {
  stateController = new StateController(this);
  static properties = {
    fileName: {},
    fileContents: {},
    fileMimeType: {},
  };

  static styles = css`
    #downloadButton {
      padding: 5px 10px;
      background-color: var(--planager-foreground);
      color: var(--planager-background);
      text-align: center;
      font-weight: bolder;
      cursor: pointer;
    }

    #downloadButton:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.3) 0 0);
    }

    .hidden {
      display: none;
    }

    #textInput {
      font-size: 16px;
      font-size: max(16px, 1em);
      font-family: inherit;
      padding: 0.25em 0.5em;
      background-color: var(--planager-foreground);
      border: none;
    }

    #textInput:focus {
      outline: 5px solid var(--planager-accent-4);
      outline-offset: -5px;
    }
  `;

  constructor() {
    super();
    this.fileName = "file";
    this.fileContents = "hello world";
    this.fileMimeType = "data:text/plain";
  }

  download(e) {
    e.preventDefault();
    console.log("download!");
    // Prepare the file
    // let output = this.props.action.inports.file.value;
    // // Download it
    // const blob = new Blob([output]);
    // const fileDownloadUrl = URL.createObjectURL(blob);
    // this.setState({ fileDownloadUrl: fileDownloadUrl }, () => {
    //   this.doFileDownload.click();
    //   URL.revokeObjectURL(fileDownloadUrl); // free up storage--no longer needed.
    //   this.setState({ fileDownloadUrl: "" });
    // });
  }
  handleInput(e) {
    this.stateController.updateState("fileName", e.target.value);
  }
  render() {
    return html`
      <div className="background">
        <input id="textInput" type="text" @input=${this.handleInput} />
        <div id="downloadButton" @click=${this.download}>Download</div>
        <a
          class="hidden"
          download=${this.fileName}
          href=${`${this.fileMimeType};charset=utf-8,${encodeURIComponent(
            this.fileContents
          )}`}
        ></a>
      </div>
    `;
  }
}
