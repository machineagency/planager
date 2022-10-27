import { html } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Array2d extends Tool {
  render() {
    return this.renderModule(html`<div></div>`);
  }
}
