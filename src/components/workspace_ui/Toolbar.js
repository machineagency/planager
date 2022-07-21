import { LitElement, html, css } from "lit";
import { gear, upload, download } from "../../ui/icons";
import { unselectable } from "../../ui/styles";

import { PlanController } from "../../controllers/PlanController";

import "./ToolbarButton";

export class Toolbar extends LitElement {
  planController = new PlanController(this);
  static styles = [
    unselectable,
    css`
      #toolbar {
        background-color: var(--planager-toolbar);
        color: var(--planager-text-light);
        height: 2rem;
        position: absolute;
        display: flex;
        width: -moz-available;
        z-index: 1000;
      }
      #title {
        font-weight: bold;
        font-size: 1rem;
        margin: auto 1rem;
        cursor: default;
      }
      #toolbar planager-toolbar-button {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
      }
    `,
  ];

  render() {
    return html`<div id="toolbar">
      <span id="title" class="unselectable">Planager</span>
      <planager-toolbar-button @click=${this.planController.downloadPlan}
        >${download}</planager-toolbar-button
      >
      <planager-toolbar-button @click=${this.planController.uploadPlan}
        >${upload}</planager-toolbar-button
      >
      <planager-toolbar-button>${gear}</planager-toolbar-button>
    </div>`;
  }
}
customElements.define("planager-toolbar", Toolbar);
