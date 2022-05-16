import { LitElement, html, css } from "lit";
import { map } from "lit/directives/map.js";
import { ref, createRef } from "lit/directives/ref.js";

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
  canvasRef = createRef();

  static properties = {
    socket: {},
    modules: {},
  };

  constructor() {
    super();
    this.modules = [];
    this.socket = io.connect("http://localhost:5000/");
    this.socket.emit("newPlan");
  }

  handleNewAction(module) {
    this.modules.push(module);
    this.requestUpdate();
  }

  render() {
    return html`
      <main>
        <planager-toolbar .socket=${this.socket}></planager-toolbar>
        <planager-library
          .socket=${this.socket}
          .addAction=${this.handleNewAction.bind(this)}
        ></planager-library>
        <planager-canvas ${ref(this.canvasRef)}>
          ${map(
            this.modules,
            (mod) =>
              html`<planager-draggable slot="module"></planager-draggable>`
          )}
        </planager-canvas>
      </main>
    `;
  }
}
customElements.define("planager-workspace", PlanagerWorkspace);
