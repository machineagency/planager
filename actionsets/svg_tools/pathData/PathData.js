import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class PathData extends Tool {
  static styles = css``;

  render() {
    let displayText = "No input path!";
    if (this.inports.svg) {
      var el = SVG(this.inports.svg);
      let d = el.attr("d");
      displayText = d;
      this.api.runMethod("set_d_string", d);
    }

    return this.renderModule(html`<div>${displayText}</div>`);
  }
}
