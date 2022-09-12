import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Axi extends Tool {
  static styles = css`
    .button {
      background-color: var(--planager-blue);
      color: var(--planager-text-light);
      padding: 0.2rem 0.5rem;
      text-align: center;
    }
    .button:hover {
      background-color: var(--planager-workspace-background);
      cursor: pointer;
    }
    .label {
      background-color: var(--planager-toolbar);
      text-align: right;
      padding: 0.2rem 0.5rem;
      font-weight: bolder;
    }
    .info {
      padding: 0.2rem 0.5rem;
      background-color: var(--planager-module-background);
      color: var(--planager-text-dark);
      font-weight: normal;
      font-style: italic;
    }
    #control-container {
      grid-template-columns: auto auto auto;
      display: grid;
      font-size: 0.75rem;
      color: var(--planager-text-light);
      user-select: none;
    }
  `;
  render() {
    return this.renderModule(html`<div id="control-container" class="container">
      <span class="label">connected</span
      ><span class="info">${this.state.connected}</span>
      <div class="button" @click=${(e) => this.api.runMethod("connect")}>
        connect
      </div>
      <span class="label">mode</span
      ><span class="info"
        >${this.state.interactive ? "interactive" : "direct"}</span
      >
      <div class="button" @click=${(e) => this.api.runMethod("connect")}>
        toggle
      </div>
    </div>`);
  }
}
