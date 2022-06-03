import { LitElement, html, css } from "lit";

export class PlanagerLibrary extends LitElement {
  static properties = {
    modules: {},
  };

  static styles = css`
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

  render() {
    return html`
      ${Object.entries(this.modules).map(
        (module) =>
          html`<div
            class="action-item"
            @click=${() => this.handleModuleClick(module)}
          >
            ${module[0]}
          </div>`
      )}
    `;
  }
}
customElements.define("planager-library", PlanagerLibrary);
