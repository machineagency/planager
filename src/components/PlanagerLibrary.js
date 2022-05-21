import { LitElement, html, css } from "lit";

export class PlanagerLibrary extends LitElement {
  static properties = {
    modules: {},
  };

  static styles = css`
    #library-pane {
      background-color: var(--planager-foreground);
    }
    #library-header {
      background-color: var(--planager-accent-1);
      display: flex;
    }
    #library-title {
      font-size: 1rem;
      color: var(--planager-foreground);
      margin: auto;
      font-weight: bolder;
    }
    .action-item {
      cursor: pointer;
      font-size: 1rem;
      padding: 0 0.5rem;
      color: var(--planager-background);
    }
    .action-item:hover {
      background-color: var(--planager-accent-5);
      color: var(--planager-foreground);
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
    return html`<div id="library-pane">
      <div id="library-header"><span id="library-title">Library</span></div>
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
