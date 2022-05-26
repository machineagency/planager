import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";

export default class Axi extends LitElement {
  p = new StateController(this);

  static styles = css``;

  handleClick(e) {
    this.socket.emit(`${this.info.id}_method`, "do_move");
  }

  render() {
    return html`<div>Connected: ${this.p.state.connected}</div>
      <div>
        Position: ${this.p.state.position[0]}, ${this.p.state.position[1]}
      </div>
      <div>Pen: ${this.p.state.pen}</div>
      <div>Updating live? ${this.p.state.live}</div>
      <button @click=${this.handleClick}>I like to move it move it</button>`;
  }
}
