import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import { select } from "d3";

export default class SvgViewer extends Tool {
  static styles = css`
    #vizContainer {
    }
  `;

  updateSVG() {
    let container = select(this.shadowRoot.querySelector("#vizContainer"));
    container.selectAll("svg").remove();
    container.html(this.inports.svg);
  }

  render() {
    this.updateSVG();
    return html`<div id="vizContainer"></div>`;
  }
}
