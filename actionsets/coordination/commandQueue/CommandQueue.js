import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class CommandQueue extends Tool {
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
    return this.renderModule(html`<div>
      <div class="button" @click=${(e) => this.api.runMethod("send")}>Send</div>
      <div class="button" @click=${(e) => this.api.runMethod("clear")}>
        Clear
      </div>
    </div>`);
  }
}
