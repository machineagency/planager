import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class Motion extends LitElement {
  p = new StateController(this);

  static styles = css`
    #drawing {
      height: 10rem;
      width: 10rem;
    }
  `;
  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#drawing");
    var draw = SVG().addTo(this.canvas).size("100%", "100%");
    var rect = draw.rect(100, 100).attr({ fill: "#f06" });
  }

  render() {
    return html`<div id="drawing"></div>`;
  }
}
