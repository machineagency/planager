import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";

export default class PlanagerTextInput extends LitElement {
  p = new StateController(this);

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
    return html`
      <div class="slidecontainer">
        <input
          type="range"
          min=${this.p.state.min}
          max=${this.p.state.max}
          class="slider"
          @input=${(e) => (this.p.state.value = e.target.value)}
        />
      </div>
      <div>Value: ${this.p.state.value}</div>
    `;
  }
}
