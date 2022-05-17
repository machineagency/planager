import { LitElement, html, css } from "lit";
import { DataController } from "../../../src/controllers/DataController";

export default class Download extends LitElement {
  dat = new DataController(this);

  static styles = css`
    #downloadButton {
      padding: 5px 10px;
      background-color: var(--blue);
      color: var(--base3);
      text-align: center;
      font-weight: bolder;
    }

    #downloadButton:hover {
      background-color: var(--blueHover);
    }

    .hidden {
      display: none;
    }
  `;
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
  render() {
    return html`
      <div className="background">
        <div id="downloadButton" @click=${this.download}>
          Download
        </div>
          download it
        </a>
      </div>
    `;
  }
}

// <!-- <a
//   className="hidden"
//   download=${"file"}
//   href="${this.state.fileDownloadUrl}"
//   ref=${(e) => (this.doFileDownload = e)}
// > -->
