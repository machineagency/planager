import { LitElement, html, css } from "lit";

class DataKey extends LitElement {
  static styles = css`
    :host {
      display: flex;
      background-color: var(--planager-workspace-background);
      align-items: center;
    }
    .key {
      color: var(--planager-text-light);
      text-align: right;
      padding: 0px 0.5rem;
    }
  `;

  static properties = {
    keyName: { type: String },
  };

  render(val) {
    return html`<div class="key">${this.keyName}</div>`;
  }
}

customElements.define("data-key", DataKey);
