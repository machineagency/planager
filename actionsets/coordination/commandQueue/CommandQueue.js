import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import { map } from "lit/directives/map.js";

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
    .command-chip {
      background-color: var(--planager-orange);
      color: var(--planager-text-light);
      font-size: x-small;
      padding: 0.2rem;
      border-radius: 0.5rem;
      font-family: monospace;
      cursor: pointer;
    }
    .command-chip:hover {
      background-color: var(--planager-workspace-background);
    }
    .command-container {
      display: flex;
      padding: 0.1rem;
    }
    #queue-container {
      max-height: 20rem;
      overflow: auto;
    }
  `;

  render() {
    return this.renderModule(html`<div id="cont">
      <div class="button" @click=${(e) => this.api.runMethod("send")}>Send</div>
      <div class="button" @click=${(e) => this.api.runMethod("clear")}>
        Clear
      </div>
      <div id="queue-container">
        ${map(
          this.state.command_queue,
          (value, index) =>
            html`<div class="command-container">
              <span
                @mouseenter=${(e) => this.api.runMethod("set_selected", index)}
                class="command-chip"
                >path</span
              >
            </div>`
        )}
      </div>
    </div>`);
  }
}
