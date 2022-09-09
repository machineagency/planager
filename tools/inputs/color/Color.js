import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Color extends Tool {
  static styles = css`
    #color-input {
      width: 100%;
      border: 0px none;
      padding: 0px;
      display: block;
      cursor: pointer;
    }
    #hexval {
      font-size: 1rem;
    }
  `;
  render() {
    return html`
      <input
        id="color-input"
        type="color"
        value=${this.state.color}
        @input=${(e) => {
          this.state.color = e.target.value;
        }}
      />
      <!-- <span id="hexval">Hex: ${this.state.color}</span> -->
    `;
  }
}
