import { LitElement, html, css } from "lit";
// import "socket.io-client";

import "./PlanagerToolbar";
import "./PlanagerDraggable";
import "./PlanagerCanvas";
import "./PlanagerLibrary";

export class PlanagerWorkspace extends LitElement {
  static styles = css`
    planager-library {
      position: absolute;
      z-index: 150;
      right: 0;
      height: 100%;
    }
  `;

  static properties = {
    socket: {},
  };

  constructor() {
    super();
    this.socket = io.connect("http://localhost:5000/");
    this.socket.emit("newPlan");
  }

  handleNewAction(action) {
    console.log(action);
  }

  render() {
    return html`
      <main>
        <planager-toolbar .socket=${this.socket}></planager-toolbar>
        <planager-library
          .socket=${this.socket}
          .addAction=${this.handleNewAction}
        ></planager-library>
        <planager-canvas>
          <planager-draggable></planager-draggable>
          <planager-draggable></planager-draggable>
          <planager-draggable></planager-draggable>
          <planager-draggable></planager-draggable>
        </planager-canvas>
      </main>
    `;
  }
}
customElements.define("planager-workspace", PlanagerWorkspace);
