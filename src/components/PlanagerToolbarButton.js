import { LitElement, html, css } from "lit";

export class PlanagerToolbarButton extends LitElement {
  static styles = css`
    ::slotted(svg) {
      fill: var(--planager-text-light);
      margin: auto;
      width: 1.5rem;
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
customElements.define("planager-toolbar-button", PlanagerToolbarButton);
