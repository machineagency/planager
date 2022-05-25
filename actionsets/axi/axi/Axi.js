import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";

export default class Axi extends LitElement {
  p = new StateController(this);

  static styles = css``;

  render() {
    return html`<div>Axidraw!${this.p.state}</div> `;
  }
}
