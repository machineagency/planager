import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class PlanagerTextInput extends Tool {
  static styles = css`
    .slidecontainer {
      width: 100%;
    }

    .slider {
      margin: 0;
      width: 100%;
      height: 25px;
      background-color: var(--planager-pink);
    }

    input[type="range"]::-webkit-slider-thumb {
      margin-top: -5px;
    }
  `;

  render() {
    return this.renderModule(html`
      <div class="slidecontainer">
        <input
          type="range"
          min=${this.state.min}
          max=${this.state.max}
          class="slider"
          @input=${(e) => (this.state.value = e.target.value)}
        />
      </div>
    `);
  }
}
