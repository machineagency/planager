import { LitElement, html, css } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";

import { themes } from "../ui/themes";

import "./PlanagerToolbar";
import "./PlanagerModule";
import "./PlanagerWorkspace";
import "./PlanagerPane";
import "./modules/PlanagerLibrary";
import "./modules/PlanagerSettings";
import "./modules/PlanViewer";

export class PlanagerRoot extends LitElement {
  canvasRef = createRef();

  static properties = {
    socket: {},
    modules: {},
    theme: {},
  };

  constructor() {
    super();
    this.modules = [];
    this.socket = io.connect("http://localhost:5000/");
    this.socket.emit("newPlan");
    this.theme = "dracula";
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
    d.info = module;
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
      <main style=${styleMap(themes[this.theme])}>
        <planager-toolbar .socket=${this.socket}></planager-toolbar>
        <planager-workspace ${ref(this.canvasRef)} .socket=${this.socket}>
          <planager-pane slot="floating" displayName="Settings"
            ><planager-settings></planager-settings
          ></planager-pane>
          <planager-pane slot="floating" displayName="Plan Viewer"
            ><plan-viewer .socket=${this.socket}></plan-viewer
          ></planager-pane>
          <planager-pane slot="floating" displayName="Tool Library">
            <planager-library
              .socket=${this.socket}
              .addModule=${this.handleNewModule.bind(this)}
            ></planager-library>
          </planager-pane>
        </planager-workspace>
      </main>
    `;
  }
}
customElements.define("planager-root", PlanagerRoot);
