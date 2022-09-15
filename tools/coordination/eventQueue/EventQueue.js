import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import { map } from "lit/directives/map.js";

export default class EventQueue extends Tool {
  static styles = css`
    .button {
      background-color: var(--planager-blue);
      color: var(--planager-text-light);
      padding: 0.2rem;
      text-align: center;
    }
    .button:hover {
      background-color: var(--planager-toolbar-background);
      cursor: pointer;
    }
    .clear {
      background-color: var(--planager-workspace-background);
    }
    .command-chip {
      background-color: var(--planager-orange);
      color: var(--planager-text-dark);
      font-size: x-small;
      padding: 0.2rem 0.5rem;
      border-radius: 0.5rem;
      font-family: monospace;
      cursor: pointer;
      width: 10rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .command-chip:hover {
      background-color: var(--planager-workspace-background);
    }
    .command-container {
      display: flex;
      margin: 0.2rem;
    }
    #queue-container {
      max-height: 20rem;
      overflow: auto;
    }
    #controls {
      display: grid;
      grid-template-columns: auto auto;
    }
  `;

  render() {
    return this.renderModule(html`<div id="controls">
        <div class="button" @click=${(e) => this.api.runMethod("send")}>
          Send
        </div>
        <div class="button clear" @click=${(e) => this.api.runMethod("clear")}>
          Clear
        </div>
      </div>
      <div id="queue-container">
        ${map(
          this.state.command_queue,
          (value, index) =>
            html`<div class="command-container">
              <span
                @mouseenter=${(e) => this.api.runMethod("set_selected", index)}
                class="command-chip"
                style="background-color: ${index == 0
                  ? "var(--planager-pink)"
                  : "var(--planager-orange)"}"
                >${value}</span
              >
            </div>`
        )}
      </div> `);
  }
}
