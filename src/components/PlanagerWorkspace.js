import { LitElement, html, css } from "lit";
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
    elements: {},
  };

  constructor() {
    super();
    this.modules = [];
    this.socket = io.connect("http://localhost:5000/");
    this.socket.emit("newPlan");
    this.elements = {};
  }

  async handleNewAction(module) {
    const elementName = (
      "planager-" + module.actionType.slice(1).join("-")
    ).toLowerCase();

    // If the element for the action has not been imported,
    // we import it and define it as a custom element
    if (!(elementName in this.elements)) {
      const modulePath = "../../" + module.actionType.join("/");
      let moduleElement = await import(
        "../../" + module.actionType.join("/") + ".js"
      );
      customElements.define(elementName, moduleElement.default);
    }

    // Create the element and add it to the modules list
    let d = document.createElement("planager-draggable");
    let el = document.createElement(elementName);
    el.socket = this.socket;
    d.appendChild(el);
    this.canvasRef.value.appendChild(d);
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
        <planager-canvas ${ref(this.canvasRef)}> </planager-canvas>
      </main>
    `;
  }
}
customElements.define("planager-workspace", PlanagerWorkspace);
