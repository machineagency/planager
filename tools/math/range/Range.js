import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Range extends Tool {
  render() {
    return this.renderModule(html`<div id="val"></div>`);
  }
}
