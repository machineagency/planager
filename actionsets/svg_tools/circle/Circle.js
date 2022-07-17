import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class Circle extends Tool {
  static styles = css`
    #drawing-container {
      display: flex;
      background-color: var(--planager-workspace-background);
      padding: 0.5rem;
    }
    #drawing {
      margin: auto;
    }
  `;

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#drawing");
    this.draw = SVG().addTo(this.canvas).size("100%", "100%");
    this.circle = this.draw.circle(this.state.diameter).fill(this.state.color);
    this.update();
  }

  render() {
    if (this.circle) {
      let radius = this.state.diameter / 2;
      this.circle.radius(radius);
      this.circle.fill(this.state.color);

      this.api.runMethod("set_svg_string", this.circle.svg());
    }
    return this.renderModule(html`<div id="drawing-container">
      <div
        id="drawing"
        style="width:${this.state.diameter}px; height: ${this.state.diameter}px"
      ></div>
    </div>`);
  }
}
