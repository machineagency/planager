import { LitElement, html, css } from "lit";
import "./PlanagerDraggableHeader";

export class PlanagerLibrary extends LitElement {
  static properties = {
    modules: {},
    dx: { reflect: true },
    dy: { reflect: true },
  };

  static styles = css`
    #library-pane {
      background-color: var(--planager-module-background);
    }
    .action-item {
      cursor: pointer;
      font-size: 1rem;
      padding: 0 0.5rem;
      color: var(--planager-text-dark);
    }
    .action-item:hover {
      background-color: var(--planager-pink);
      color: var(--planager-text-light);
    }
  `;

  constructor() {
    super();
    this.modules = {};
    this.dx = 500;
    this.dy = 500;
  }

  connectedCallback() {
    super.connectedCallback();
    this.socket.emit("getAvailableActions", (result) => {
      this.modules = result["actions"];
    });
  }

  handleModuleClick(module) {
    this.socket.emit(
      "addAction",
      {
        action: module[0],
        actionSet: module[1]["actionSet"],
      },
      (returnedModule) => {
        this.addModule(returnedModule);
      }
    );
  }
  cancel(e) {
    e.stopPropagation();
    return;
  }

  render() {
    return html`<div id="library-pane" @pointerdown=${this.cancel}>
      <planager-draggable-header
        @pointerdown=${this.handleDown}
        @pointermove=${this.handleMove}
        >Tool Library</planager-draggable-header
      >
      ${Object.entries(this.modules).map(
        (module) =>
          html`<div
            class="action-item"
            @click=${() => this.handleModuleClick(module)}
          >
            ${module[0]}
          </div>`
      )}
    </div>`;
  }
}
customElements.define("planager-library", PlanagerLibrary);
