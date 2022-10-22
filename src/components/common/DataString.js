import { LitElement, html, css } from "lit";

class DataString extends LitElement {
  static styles = css`
    :host {
      display: table;
      background-color: var(--planager-module-background);
    }

    #text-input {
      font-size: 0.75rem;
      font-family: inherit;
      caret-color: var(--planager-workspace-background);
      color: var(--planager-text-dark);
      overflow: auto;
      vertical-align: middle;
      display: table-cell;
      padding: 0 0.5rem;
    }

    #text-input:focus {
      outline: 0.2rem solid var(--planager-blue);
    }

    #text-input:empty:focus::before,
    #text-input:empty::before {
      content: "undefined";
      font-style: italic;
      color: var(--planager-gray);
    }
  `;
  static properties = {
    stringValue: { type: String },
  };
  constructor() {
    super();
    this.stringValue = "";
  }
  inactive(e) {
    let c = e.keyCode;

    if (c === 13 || c === 27) {
      this.shadowRoot.querySelector("#text-input").blur();
      // Workaround for webkit's bug
      window.getSelection().removeAllRanges();
    }
  }
  render() {
    return html`<div
      id="text-input"
      contenteditable
      role="textbox"
      @input=${(e) => this.edit(e.target.innerText)}
      @keydown=${(e) => this.inactive(e)}>
      ${this.stringValue}
    </div>`;
  }
}

customElements.define("data-string", DataString);
