import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Download extends Tool {
  static styles = css`
    #download-button {
      padding: 0.3rem 0.5rem;
      background-color: var(--planager-blue);
      color: var(--planager-text-light);
      text-align: center;
      font-weight: bolder;
      cursor: pointer;
    }

    #download-button:hover {
      background-color: var(--planager-workspace-background);
      /* filter: brightness(0.6); */
    }
  `;

  download(e) {
    console.log(this.inports);
    let anchor = document.createElement("a");
    anchor.setAttribute(
      "href",
      "data:application/json;charset=utf-8," +
        encodeURIComponent(this.inports.fileContent)
    );
    anchor.setAttribute("download", this.state.fileName);
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  render() {
    return html`<div id="download-button" @click=${(e) => this.download(e)}>
      Download
    </div>`;
  }
}
