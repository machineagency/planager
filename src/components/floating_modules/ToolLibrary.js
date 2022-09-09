import { LitElement, html, css, nothing } from "lit";
import { angleDown, angleLeft } from "../../ui/icons";

export class ToolLibrary extends LitElement {
  static properties = {
    toolLibrary: {},
  };

  static styles = css`
    .category {
      cursor: pointer;
      display: flex;
    }
    .category:hover {
      font-weight: bolder;
    }
    .categoryName {
      font-size: 0.75rem;
      color: var(--planager-text-dark);
      padding: 0.2rem 0.3rem;
      margin-right: 1rem;
    }
    .toolDropdown {
      background-color: var(--planager-module-background-accent);
    }
    .toolEntry {
      font-size: 0.75rem;
      padding: 0.2rem 0.5rem;
      cursor: pointer;
    }
    .toolEntry:hover {
      background-color: var(--planager-pink);
      color: var(--planager-text-light);
    }
    .icon {
      fill: var(--planager-text-dark);
      margin: 0 0.3rem 0 auto;
      display: flex;
    }
    .icon svg {
      height: 0.5rem;
      margin: auto;
    }
  `;

  constructor() {
    super();
    this.toolLibrary = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.socket.emit("getToolLibrary", (result) => {
      this.toolLibrary = result;
    });
  }

  loadTool(categoryName, toolName) {
    this.socket.emit(
      "addToolToToolchain",
      {
        tool: toolName,
        category: categoryName,
      },
      (returnedModule) => {
        this.addModule(returnedModule);
      }
    );
  }

  toggleCategoryExpand(categoryName) {
    this.toolLibrary[categoryName].expanded =
      !this.toolLibrary[categoryName].expanded;
    this.requestUpdate();
  }

  renderTools(categoryName, tools) {
    return html`<div class="toolDropdown">
      ${Object.keys(tools).map(
        (toolName) =>
          html`<div
            class="toolEntry"
            @click=${() => this.loadTool(categoryName, toolName)}
          >
            ${toolName}
          </div>`
      )}
    </div>`;
  }

  renderCategoryDropdown(categoryName, contents) {
    return html`<div
        class="category"
        @click=${() => this.toggleCategoryExpand(categoryName)}
      >
        <span class="categoryName">${categoryName}</span>
        <span class="icon">${contents.expanded ? angleDown : angleLeft}</span>
      </div>
      ${contents.expanded
        ? this.renderTools(categoryName, contents.members)
        : nothing}`;
  }

  render() {
    return html`
      ${Object.entries(this.toolLibrary).map((category) =>
        this.renderCategoryDropdown(category[0], category[1])
      )}
    `;
  }
}

customElements.define("tool-library", ToolLibrary);
