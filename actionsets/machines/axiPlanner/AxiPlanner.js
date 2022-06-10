import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class AxiPlanner extends Tool {
  static styles = css`
    #
  `;

  render() {
    return this.renderModule(html`<div></div>`);
  }
}
