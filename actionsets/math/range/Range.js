import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Range extends Tool {
  static styles = css`
    #val {
      padding: 1 rem;
    }
  `;

  render() {
    return this.renderModule(html`<div id="val">
      ${this.state.multiplier}
    </div>`);
  }
}
