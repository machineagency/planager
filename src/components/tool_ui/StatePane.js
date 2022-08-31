import { LitElement, html, css, nothing } from "lit";
import { unselectable } from "../../ui/styles";

function* intersperse(a, delim) {
  let first = true;
  for (const x of a) {
    if (!first) yield delim;
    first = false;
    yield x;
  }
}

const comma = html`,`;
const openSquareBracket = html`[`;
const closeSquareBracket = html`]`;
const openCurlyBrace = html`{`;
const closeCurlyBrace = html`}`;
const newLine = html`<br />`;

class StatePane extends LitElement {
  static properties = {
    state: { type: Object },
    numPrecision: { type: Number },
    expanded: { type: Boolean },
  };

  static styles = [
    unselectable,
    css`
      #header {
        background-color: var(--planager-gray);
        color: var(--planager-text-light);
        font-size: 0.7rem;
        font-weight: bolder;
      }
      #header:hover {
        background-color: var(--planager-workspace-background);
        cursor: pointer;
      }
      .state-entry {
        max-width: 20rem;
        padding: 0.2rem;
      }
      .number {
        color: var(--planager-blue);
        padding: 0.1rem;
      }
      .number:hover {
        color: var(--planager-text-light);
        background-color: var(--planager-blue);
      }
      .string {
        color: var(--planager-text-dark);
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 50ch;
      }
      .boolean {
        color: var(--planager-purple);
      }
      .array-decor {
        color: var(--planager-text-dark);
      }
      #state-container {
        display: grid;
        grid-template-columns: auto auto;
        padding: 0.2rem;
        font-size: 0.7rem;
        cursor: pointer;
        width: min-content;
      }
      .key {
        text-align: right;
        font-weight: bolder;
        padding: 0.1rem;
      }
      .key:hover {
        color: var(--planager-text-light);
        background-color: var(--planager-pink);
      }
      .value {
        margin: auto 0;
      }
      .keyval-container {
        display: flex;
        flex-wrap: nowrap;
      }
    `,
  ];

  constructor() {
    super();
    this.numPrecision = 3;
    this.expanded = false;
  }

  renderObject(val) {
    if (Array.isArray(val)) return this.renderArray(val);
    if (!val) return this.renderNull();
    let arr = [];
    for (const [key, value] of Object.entries(val)) {
      arr.push(
        html`<div class="keyval-container">
          <span class="key">${key}:</span>
          <span class="value">${this.renderValue(value)}</span>
        </div>`
      );
    }
    return arr;
  }

  renderPreview(numChildren) {
    return html`<span>...</span>`;
  }

  renderArray(val) {
    let arrHTML = [];
    for (const item of val) {
      arrHTML.push(this.renderValue(item));
    }
    let n = [
      openSquareBracket,
      ...intersperse(arrHTML, comma),
      closeSquareBracket,
    ];
    return n;
  }

  renderNull() {
    return html`<span class="undef">null</span>`;
  }

  renderNumber(val) {
    return html`<span class="number">${val}</span>`;
  }

  renderString(val) {
    return html`<span class="string">${val}</span>`;
  }

  renderBoolean(val) {
    return html`<span class="boolean">${val}</span>`;
  }

  renderUndefined(val) {
    return html`<span>undef</span>`;
  }

  renderPrimitive(node, path) {}

  renderValue(value) {
    let renderedValue;
    switch (typeof value) {
      case "object":
        renderedValue = this.renderObject(value);
        break;
      case "number":
        renderedValue = this.renderNumber(value);
        break;
      case "string":
        renderedValue = this.renderString(value);
        break;
      case "boolean":
        renderedValue = this.renderBoolean(value);
        break;
      case "undefined":
        renderedValue = this.renderUndefined(value);
        break;
    }
    // let node = html`<div class="node">${renderedValue}</div>`;
    let node = renderedValue;
    return node;
  }

  toggleCollapse() {
    this.expanded = !this.expanded;
  }

  renderState() {
    let arr = [];
    for (const [key, value] of Object.entries(this.state)) {
      arr.push(
        html` <span class="key">${key}:</span>
          <span class="value">${this.renderValue(value)}</span>`
      );
    }
    return arr;
  }

  render() {
    return html`<div>
      <div id="header" class="unselectable" @click=${this.toggleCollapse}>
        State
      </div>
      ${this.expanded
        ? html`<div id="state-container">${this.renderState()}</div>`
        : nothing}
    </div>`;
  }
}

customElements.define("state-pane", StatePane);
