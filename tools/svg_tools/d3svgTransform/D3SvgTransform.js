import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import { create } from "d3";

export default class D3SvgTransform extends Tool {
  static styles = css`
    #svg-content {
      display: none;
    }
  `;

  render() {
    if (!this.inports.elements) return;

    const scale = this.inports.scale ? this.inports.scale : 1;
    const translateX = this.inports.translateX ? this.inports.translateX : 0;
    const translateY = this.inports.translateY ? this.inports.translateY : 0;
    const width = this.inports.width ? this.inports.width : "430mm";
    const height = this.inports.height ? this.inports.height : "297mm";

    const detachedSVG = create("svg")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .attr("width", width)
      .attr("height", height);

    detachedSVG.append("g").attr(
      "transform",
      `translate(${translateX}, ${translateY})
      scale(${scale}, ${scale})`
    );

    detachedSVG.select("g").html(this.inports.elements.join(""));

    this.api.runMethod("set_svg_string", detachedSVG.node().outerHTML);

    return html`<div id="container"></div>`;
  }
}
