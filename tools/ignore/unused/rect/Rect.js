import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class Rect extends Tool {
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
    this.rect = this.draw
      .rect(this.state.width, this.state.height)
      .fill(this.state.color);
    this.update();
  }

  render() {
    if (this.rect) {
      this.rect.size(this.state.width, this.state.height);
      this.rect.fill(this.state.color);
      this.rect.attr({
        x: this.state.translate.x,
        y: this.state.translate.y,
      });
      this.api.runMethod("set_svg_string", this.rect.svg());
    }
    return this.renderModule(html`<div id="drawing-container">
      <div
        id="drawing"
        style="width:${this.state.width}px; height: ${this.state.height}px"
      ></div>
    </div>`);
  }
}
