import { LitElement, html, css } from "lit";
import { ref, createRef } from "lit/directives/ref.js";

import "./PlanagerToolbar";
import "./PlanagerModule";
import "./PlanagerCanvas";
import "./PlanagerLibrary";
import "./PlanagerPipe";

export class PlanagerWorkspace extends LitElement {
  static styles = css`
    planager-library {
      position: absolute;
      z-index: 150;
      right: 0;
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

  async handleNewModule(module) {
    const elementName = (
      "planager-" + module.actionType.slice(1).join("-")
    ).toLowerCase();

    // If the element for the action has not been registered
    // we import it and define it as a custom element
    if (!customElements.get(elementName)) {
      const modulePath = `../../${module.actionType.join("/")}.js`;
      let moduleElement = await import(modulePath);
      customElements.define(elementName, moduleElement.default);
    }

    // Create the element, put it inside a draggable, and append it as a child to the canvas
    let d = document.createElement("planager-module");
    d.slot = "draggable";
    let el = document.createElement(elementName);
    // Pass it the socket connection
    el.socket = this.socket;
    el.info = module;
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
          .addModule=${this.handleNewModule.bind(this)}
        ></planager-library>
        <planager-canvas ${ref(this.canvasRef)}> </planager-canvas>
      </main>
    `;
  }
}
customElements.define("planager-workspace", PlanagerWorkspace);
