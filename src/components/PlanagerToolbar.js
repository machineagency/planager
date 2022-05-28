import { LitElement, html, css } from "lit";
import { gear, upload, download } from "../ui/icons";
import { unselectable } from "../ui/styles";

import { PlanController } from "../controllers/PlanController";

import "./PlanagerToolbarButton";

export class PlanagerToolbar extends LitElement {
  planController = new PlanController(this);
  static styles = [
    unselectable,
    css`
      #toolbar {
        background-color: var(--planager-toolbar);
        color: var(--planager-text-light);
        height: 2rem;
        z-index: 100;
        position: sticky;
        display: flex;
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
customElements.define("planager-toolbar", PlanagerToolbar);
