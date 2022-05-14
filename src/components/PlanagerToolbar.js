import { LitElement, html, css } from "lit";

export class PlanagerToolbar extends LitElement {
  static styles = css`
    #toolbar {
      background-color: var(--planager-background2);
      color: var(--planager-foreground2);
      height: 3rem;
      z-index: 100;
      position: sticky;
      display: flex;
      /* justify-content: space-between; */
    }
    #title {
      font-family: "helvetica";
      font-weight: bold;
      font-size: 1.5rem;
      margin: auto 1rem;
    }
    .toolbar-item {
      margin: auto 1rem;
    }
    .menu-item {
      font-family: helvetica;
      font-weight: normal;
      font-size: 1rem;
    }
    #settings {
      margin: auto 1rem auto auto;
    }
  `;

  render() {
    return html`<div id="toolbar">
      <span id="title">Planager</span>
      <span class="toolbar-item menu-item">upload</span>
      <span id="settings" class="menu-item">settings</span>
    </div>`;
  }
}
customElements.define("planager-toolbar", PlanagerToolbar);
