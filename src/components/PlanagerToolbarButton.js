import { LitElement, html, css } from "lit";

export class PlanagerToolbarButton extends LitElement {
  static styles = css`
    ::slotted(svg) {
      fill: var(--planager-text-light);
      width: 2rem;
    }
    :host {
      cursor: pointer;
      margin: auto;
    }
    #icon {
      display: inline-block;
    }
    #icon:hover ::slotted(svg) {
      fill: var(--planager-green);
    }
  `;
  render() {
    return html`<span id="icon"><slot></slot></span>`;
  }
}
customElements.define("planager-toolbar-button", PlanagerToolbarButton);
