import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class Circle extends LitElement {
  p = new StateController(this);

  static styles = css`
    #drawing {
      background-color: var(--planager-workspace-background);
    }
  `;

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#drawing");
    this.draw = SVG().addTo(this.canvas).size("100%", "100%");
    this.circle = this.draw
      .circle(this.p.state.diameter)
      .fill("var(--planager-text-light)");
  }

  render() {
    if (this.circle) {
      let radius = this.p.state.diameter / 2;
      this.circle.radius(radius);
      this.circle.attr({ cx: radius, cy: radius });
    }
    return html`<div
      id="drawing"
      style="width:${this.p.state.diameter}px; height: ${this.p.state
        .diameter}px"
    ></div>`;
  }
}
