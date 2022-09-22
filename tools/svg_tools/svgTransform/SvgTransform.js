import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class SvgTransform extends Tool {
  isCapturing;
  path;
  points;
  allPaths;

  static styles = css`
    #svg-content {
      display: none;
    }
  `;

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#svg-content");
    this.drawing = SVG(this.canvas).size("100%", "100%");
  }

  render() {
    if (this.drawing && this.inports.element) {
      this.drawing.clear();
      let el = SVG(this.inports.element).addTo(this.drawing);
      if (this.inports.translate) {
        // console.log(this.inports.translate);
        el.transform({ translate: this.inports.translate });
      }
      // if (this.inports.scale) el.transform({ scale: this.inports.scale });
      if (this.inports.fill) el.fill(this.inports.fill);
      if (this.inports.stroke) el.stroke(this.inports.stroke);

      this.api.runMethod("set_svg_string", el.svg());
    } else {
      this.api.runMethod("set_svg_string", null);
    }
    return html`<div id="drawing">
      <svg id="svg-content"></svg>
    </div>`;
  }
}
