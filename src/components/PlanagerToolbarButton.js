import { LitElement, html, css } from "lit";

export class PlanagerToolbarButton extends LitElement {
  static styles = css`
    #toolbar {
      background-color: var(--planager-background2);
      color: var(--planager-foreground);
    }
  `;

  render() {
    return html`<div id="toolbar"></div>`;
  }
}
customElements.define("planager-toolbar-button", PlanagerToolbarButton);
