import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Axi extends Tool {
  handleClick(e) {
    this.socket.emit(`${this.info.id}_method`, "do_move");
  }

  render() {
    return this.renderModule(html`<div>Connected: ${this.state.connected}</div>
      <div>Position: ${this.state.position[0]}, ${this.state.position[1]}</div>
      <div>Pen: ${this.state.pen}</div>
      <button @click=${this.handleClick}>I like to move it move it</button>`);
  }
}
