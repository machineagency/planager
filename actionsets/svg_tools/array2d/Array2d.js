import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class Array2d extends Tool {
  static styles = css`
    /* #drawing {
      width: 10rem;
    } */
  `;

  render() {
    return this.renderModule(html`<div id="drawing"></div>`);
  }
}
