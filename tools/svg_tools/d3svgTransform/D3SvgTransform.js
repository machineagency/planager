import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import { selectAll, create } from "d3";

export default class D3SvgTransform extends Tool {
  static styles = css`
    #svg-content {
      display: none;
    }
  `;

  render() {
    if (!this.inports.element) return;

    const detachedSVG = create("svg");
    detachedSVG.html(this.inports.element);
    // console.log(detachedSVG);

    const paths = detachedSVG
      .selectAll("path")
      .attr("transform", "translate(50, 50)");
    console.log(paths);

    return html`<div id="container"></div>`;
  }
}
