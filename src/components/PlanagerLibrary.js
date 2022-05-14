import { LitElement, html, css } from "lit";

export class PlanagerLibrary extends LitElement {
  static properties = {
    actions: {},
  };

  static styles = css`
    #library-pane {
      background-color: var(--planager-foreground);
    }
    #library-header {
      background-color: var(--planager-accent-secondary);
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
      background-color: var(--planager-accent);
      color: var(--planager-foreground);
    }
  `;

  constructor() {
    super();
    this.actions = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.socket.emit("getAvailableActions", (result) => {
      this.actions = result["actions"];
    });
  }

  handleActionClick(action) {
    this.socket.emit(
      "addAction",
      {
        action: action[0],
        actionSet: action[1]["actionSet"],
      },
      (returnedAction) => {
        this.addAction(returnedAction);
      }
    );
  }

  render() {
    return html`<div id="library-pane">
      <div id="library-header"><span id="library-title">Library</span></div>
      ${Object.entries(this.actions).map(
        (action) =>
          html`<div
            class="action-item"
            @click=${() => this.handleActionClick(action)}
          >
            ${action[0]}
          </div>`
      )}
    </div>`;
  }
}
customElements.define("planager-library", PlanagerLibrary);
