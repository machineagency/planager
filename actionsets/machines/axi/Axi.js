import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Axi extends Tool {
  handleClick(e) {
    this.api.runMethod("do_move");
  }

  render() {
    return this.renderModule(html` <button @click=${this.handleClick}>
      Move queue
    </button>`);
  }
}
