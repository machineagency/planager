import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class StrokeOrder extends Tool {
  static styles = css``;

  render() {
    return this.renderModule(
      html`<div id="drawing">${this.inports.moves}</div>`
    );
  }
}
