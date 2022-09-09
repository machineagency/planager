import { html, css, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class PathTemplate extends Tool {
  static styles = css`
    .varSlot {
      background-color: var(--planager-blue);
      padding: 0.2rem;
      margin: 0.2rem;
      border-radius: 0.3rem;
      color: white;
      cursor: pointer;
    }

    #assignVars {
      padding: 0.5rem;
    }
  `;

  render() {
    let variableMap = nothing;
    if (this.inports.ranges) {
      variableMap = repeat(
        Object.entries(this.inports.ranges),
        (item) => item[0],
        (inportVars) =>
          html`<div>ID:${inportVars[0]}, val:${inportVars[1]}</div>`
      );
    }
    let slotList = nothing;
    if (this.state.slots) {
      slotList = repeat(
        this.state.slots,
        (slotName) => html`<span class="varSlot">${slotName}</span>`
      );
    }
    return this.renderModule(html`<div id="template-container">
      ${variableMap}
      <div id="assignVars">${slotList}</div>
      <input
        type="text"
        value=${this.state.templateString}
        @input=${(e) => {
          this.state.templateString = e.target.value;
        }}
      />
    </div>`);
  }
}
