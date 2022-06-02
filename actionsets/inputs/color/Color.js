import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";
import { MouseController } from "../../../src/controllers/MouseController";

export default class Color extends LitElement {
  p = new StateController(this);

  render() {
    return html`
      <input
        id="textInput"
        type="color"
        value=${this.p.state.color}
        @input=${(e) => {
          this.p.state.color = e.target.value;
        }}
      />
    `;
  }
}
