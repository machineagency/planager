import { LitElement, html, css } from "lit";
import { ToolchainController } from "../../controllers/ToolchainController";

import "../common/DataObject.js";
import "../common/DataKey.js";
import "../common/DataString.js";

export class ToolchainInfo extends LitElement {
  toolchainController = new ToolchainController(this);
  static styles = css`
    #toolchain-container {
      display: grid;
      grid-template-columns: auto auto;
    }
  `;
  static properties = {
    toolchain: { type: Object },
  };
  constructor() {
    super();
    this.toolchain = {};
  }
  connectedCallback() {
    super.connectedCallback();
    this.socket.emit("get_toolchain_info", (message) => {
      this.toolchain = message;
      console.log(message);
      this.requestUpdate();
    });
    this.socket.on("toolchain_info", (message) => {
      this.toolchain = message;
      console.log(message);
      this.requestUpdate();
    });
  }
  render() {
    return html`<div id="toolchain-container">
      <data-key keyname="name"></data-key
      ><data-string
        .edit=${(name) => this.toolchainController.setName(name)}
        .stringValue=${this.toolchain.name}
      ></data-string>
    </div>`;
  }
}
customElements.define("toolchain-info", ToolchainInfo);
