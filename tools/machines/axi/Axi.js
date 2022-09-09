import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Axi extends Tool {
  static styles = css`
    .button {
      background-color: var(--planager-blue);
      color: var(--planager-text-light);
      padding: 0.2rem;
    }
    .button:hover {
      background-color: var(--planager-workspace-background);
      cursor: pointer;
    }
  `;
  render() {
    return this.renderModule(html`<div>Connected: ${this.state.connected}</div>
      <div class="button" @click=${(e) => this.api.runMethod("motor_status")}>
        Turn off motors
      </div>
      <div class="button" @click=${(e) => this.api.runMethod("set_home")}>
        Set Home
      </div>`);
  }
}
