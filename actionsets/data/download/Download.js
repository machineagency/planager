import { LitElement, html, css } from "lit";
import { MessageController } from "../../../src/controllers/MessageController";

export default class Download extends LitElement {
  messenger = new MessageController(this);

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
