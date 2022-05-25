import { LitElement, html, css } from "lit";
import { gear, upload } from "../ui/icons";
import { unselectable } from "../ui/styles";

import "./PlanagerToolbarButton";

export class PlanagerToolbar extends LitElement {
  static styles = [
    unselectable,
    css`
      #toolbar {
        background-color: var(--planager-toolbar);
        color: var(--planager-text-light);
        height: 3rem;
        z-index: 100;
        position: sticky;
        display: flex;
      }
      #title {
        font-weight: bold;
        font-size: 1.5rem;
        margin: auto 1rem;
        cursor: default;
      }
      #upload {
        margin-right: 0;
      }
      #settings {
        margin-left: 1rem;
        margin-right: 1rem;
      }
    `,
  ];

  render() {
    return html`<div id="toolbar">
      <span id="title" class="no-select">Planager</span>
      <planager-toolbar-button id="upload">${upload}</planager-toolbar-button>
      <planager-toolbar-button id="settings">${gear}</planager-toolbar-button>
    </div>`;
  }
}
customElements.define("planager-toolbar", PlanagerToolbar);
