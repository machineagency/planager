import { LitElement, html, css } from "lit";

class InputText extends LitElement {
  static styles = css`
    .text-input {
      color: var(--planager-text-dark);
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 50ch;
    }
  `;
  render(val) {
    return html`<div contenteditable id="text-input"></div>`;
  }
}

customElements.define("input-text", InputText);
