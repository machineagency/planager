import { LitElement, html, css } from "lit";

export class ToolbarButton extends LitElement {
  static styles = css`
    ::slotted(svg) {
      fill: var(--planager-text-light);
      margin: auto;
      max-height: 1rem;
      height: 1rem;
    }
    :host {
      cursor: pointer;
      margin: auto;
    }
    #icon {
      display: flex;
    }
    #icon:hover ::slotted(svg) {
      fill: var(--planager-orange);
    }
  `;
  render() {
    return html`<span id="icon"><slot></slot></span>`;
  }
}
customElements.define("planager-toolbar-button", ToolbarButton);
