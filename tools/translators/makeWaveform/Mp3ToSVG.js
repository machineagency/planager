import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Mp3ToSVG extends Tool {
  static styles = css``;

  render() {
    return this.renderModule(html`<div></div>`);
  }
}
