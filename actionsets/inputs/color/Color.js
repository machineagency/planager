import { html } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Color extends Tool {
  render() {
    return this.renderModule(html`
      <input
        type="color"
        value=${this.state.color}
        @input=${(e) => {
          this.state.color = e.target.value;
        }}
      />
    `);
  }
}
