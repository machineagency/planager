import { LitElement, html, css } from "lit";
import { unselectable } from "../ui/styles";

export class PlanagerDraggableHeader extends LitElement {
  static styles = [
    unselectable,
    css`
      #header {
        background-color: var(--planager-purple);
        color: var(--planager-text-light);
        display: flex;
        cursor: move;
        padding: 0.2rem;
        min-height: 0.5rem;
      }
      #title {
        font-size: 1rem;
        font-weight: bolder;
      }
    `,
  ];

  render() {
    return html`<div id="header" class="unselectable">
      <span id="title"><slot></slot></span>
    </div>`;
  }
}
customElements.define("planager-draggable-header", PlanagerDraggableHeader);
