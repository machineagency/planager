import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Download extends Tool {
  static styles = css`
    #button-container {
      height: 100%;
      background-color: var(--planager-blue);
      color: var(--planager-text-light);
      display: flex;
      font-weight: bolder;
      font-size: 0.75rem;
      cursor: pointer;
      user-select: none;
      justify-content: space-around;
      align-items: center;
    }

    #button-container:hover {
      background-color: var(--planager-workspace-background);
    }
  `;

  download(e) {
    if (!this.inports.mime || !this.inports.file) return;
    let anchor = document.createElement("a");
    anchor.setAttribute(
      "href",
      `data:${this.inports.mime};charset=utf-8,${encodeURIComponent(
        this.inports.file
      )}`
    );
    anchor.setAttribute(
      "download",
      this.inports.name ? this.inports.name : "file"
    );
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  render() {
    return html`<div id="button-container" @click=${(e) => this.download(e)}>
      <div id="button-text">Download</div>
    </div>`;
  }
}
