import { LitElement, html, css, nothing } from "lit";
import { angleDown, angleLeft } from "../../ui/icons";

export class ExamplePane extends LitElement {
  static properties = {
    exampleLibrary: {},
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
    this.exampleLibrary = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.socket.emit("get_examples", (result) => {
      this.exampleLibrary = result;
    });
  }

  loadTool(name) {
    this.socket.emit(
      "load_example",
      {
        name: name,
      },
      (returnedModule) => {
        this.addModule(returnedModule);
      }
    );
  }

  toggleCategoryExpand(categoryName) {
    this.exampleLibrary[categoryName].expanded =
      !this.exampleLibrary[categoryName].expanded;
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
      ${Object.entries(this.exampleLibrary).map((category) =>
        this.renderCategoryDropdown(category[0], category[1])
      )}
    `;
  }
}

customElements.define("example-pane", ExamplePane);
