import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";

export default class ColorVis extends LitElement {
  p = new StateController(this);

  static styles = css`
    #viz {
      height: 3rem;
    }
  `;

  render() {
    return html`
      <div id="viz" style="background-color:${this.p.state.color}"></div>
    `;
  }
}
