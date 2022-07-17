import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class SvgViewer extends Tool {
  static styles = css`
    #drawing {
      height: 10rem;
      width: 10rem;
    }
  `;

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#svg-content");
    this.drawing = SVG(this.canvas).size("100%", "100%");
  }

  render() {
    if (this.drawing && this.inports.svg) {
      this.drawing.clear();
      let el = SVG(this.inports.svg).addTo(this.drawing);
    }
    return this.renderModule(
      html`<div id="drawing">
        <svg id="svg-content"></svg>
      </div>`
    );
  }
}
