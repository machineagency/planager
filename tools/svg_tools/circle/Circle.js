import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class Circle extends Tool {
  static styles = css`
    #drawing {
      padding: 0.5rem;
      display: flex;
      background-color: var(--planager-workspace-background);
    }
  `;

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#drawing");
    this.draw = SVG()
      .addTo(this.canvas)
      .size(`${this.state.diameter}px`, `${this.state.diameter}px`);
    this.circle = this.draw.circle(this.state.diameter).fill(this.state.color);
    this.update();
  }

  render() {
    if (this.circle) {
      let radius = this.state.diameter / 2;
      this.circle.radius(radius);
      this.circle.fill(this.state.color);
      this.circle.cx(0);
      this.circle.cy(0);
      this.circle.translate(radius, radius);

      this.api.runMethod("set_svg_string", this.circle.svg());
    }
    return this.renderModule(html` <div id="drawing"></div> `);
  }
}
