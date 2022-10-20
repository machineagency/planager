import { LitElement, html } from "lit";
import { ref, createRef } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";

import { themes } from "./ui/themes";
import { ToolchainController } from "./controllers/ToolchainController";

// Basic workspace things
import "./components/workspace_ui/Workspace";
import "./components/workspace_ui/Toolbar";

// Tool UI
import "./components/tool_ui/Module";
import "./components/tool_ui/Pane";

// Floating Modules
import "./components/floating_modules/ToolLibrary";
import "./components/floating_modules/PlanagerSettings";
import "./components/floating_modules/ToolchainInfo";

export class PlanagerRoot extends LitElement {
  canvasRef = createRef();
  toolchainController = new ToolchainController(this);
  currentOffset = { x: 100, y: 100 };

  static properties = {
    socket: {},
    modules: {},
    theme: {},
  };

  constructor() {
    super();
    this.modules = [];
    // this.socket = io.connect("http://localhost:5000/");
    // this.socket = io.connect({ transports: ["websocket"] });
    // this.socket = io.connect({ transports: ["websocket", "polling"] });
    this.socket = io.connect();

    this.socket.on("connect", () => {
      console.log("Connected to backend!");
      this.socket.emit("message", this.socket.id);
      console.log("Socket ID:", this.socket.id);
      const engine = this.socket.io.engine;
      console.log("engine transport is", engine.transport.name); // in most cases, prints "polling"
      engine.once("upgrade", () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log("upgraded, now", engine.transport.name); // in most cases, prints "websocket"
      });
    });

    this.socket.on("reconnect", () => {
      console.log("Reconnected!");
      console.log("Socket ID:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    this.socket.on("tool_added", (module, callback) => {
      this.handleNewModule(module).then(() => callback(module.id));
    });

    // this.socket.emit("new_toolchain");
    this.theme = "dracula";
  }

  handleKeyDown(event) {
    // TODO: There is a bug where the key combos result in an infinite loop ?
    let charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === "s") {
      event.preventDefault();
      this.toolchainController.downloadToolchain(event);
    } else if ((event.ctrlKey || event.metaKey) && charCode === "c") {
      event.preventDefault();
      console.log("CTRL+C Pressed");
    } else if ((event.ctrlKey || event.metaKey) && charCode === "v") {
      event.preventDefault();
      console.log("CTRL+V Pressed");
    } else if ((event.ctrlKey || event.metaKey) && charCode === "z") {
      event.preventDefault();
      console.log("CTRL+Z pressed");
    }
  }

  connectedCallback() {
    super.connectedCallback();
    addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  increaseOffset() {
    this.currentOffset.x += 10;
    this.currentOffset.y += 10;
  }

  handleRemove(e, toolID) {
    // TODO: This should instead request a tool's removal, and there should be a listener for tool_removed messages
    this.socket.emit("remove_tool", toolID, () => {
      let toolToRemove = this.canvasRef.value.querySelector(
        `planager-module[toolid="${toolID}"]`
      );
      // TODO: Go through and confirm that any attached pipes are removed
      this.canvasRef.value.removeChild(toolToRemove);
    });
  }

  async handleNewModule(module) {
    const elementName = (
      "planager-" + module.toolType.slice(1).join("-")
    ).toLowerCase();

    // If the element for the tool has not been registered
    // we import it and define it as a custom element
    if (!customElements.get(elementName)) {
      const modulePath = `../../${module.toolType.join("/")}.js`;
      let moduleElement = await import(modulePath);
      try {
        customElements.define(elementName, moduleElement.default);
      } catch {
        console.log(elementName, "already defined");
      }
    }

    // Create the element, put it inside a draggable, and append it as a child to the canvas inside the tool slot
    let d = document.createElement("planager-module");
    d.slot = "tools";
    d.info = module;
    d.toolid = module.id;

    if (d.info.coords) {
      // If the tool includes coordinates, set them as the tool location
      d.dx = d.info.coords.x;
      d.dy = d.info.coords.y;
    } else {
      // Otherwise use the default offset and increase it so it is staggered
      d.dx = this.currentOffset.x;
      d.dy = this.currentOffset.y;
      this.increaseOffset();
    }
    this.socket.emit("update_tool_coordinates", {
      tool_id: d.info.id,
      coordinates: { x: d.dx, y: d.dy },
    });
    let el = document.createElement(elementName);
    // Pass it the socket connection
    el.socket = this.socket;
    el.info = module;
    d.handleRemove = (e) => this.handleRemove(e, d.info.id);
    d.appendChild(el);
    this.canvasRef.value.appendChild(d);
    this.requestUpdate();

    return "DONE";
  }

  render() {
    return html`
      <main style=${styleMap(themes[this.theme])}>
        <planager-toolbar .socket=${this.socket}></planager-toolbar>
        <planager-workspace
          ${ref(this.canvasRef)}
          .socket=${this.socket}>
          <!-- <planager-pane
            slot="floating"
            displayName="Settings"
            style="--dx:1100;--dy:300"
            ><planager-settings></planager-settings
          ></planager-pane> -->
          <!-- <planager-pane
            slot="floating"
            displayName="Toolchain Info"
            .dx=${0}
            .dy=${500}
            ><toolchain-info .socket=${this.socket}></toolchain-info
          ></planager-pane> -->
          <planager-pane
            slot="floating"
            displayName="Tool Library"
            .dx=${0}
            .dy=${30}>
            <tool-library
              .socket=${this.socket}
              .addModule=${this.handleNewModule.bind(this)}></tool-library>
          </planager-pane>
        </planager-workspace>
      </main>
    `;
  }
}
customElements.define("planager-root", PlanagerRoot);
