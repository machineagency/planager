import { LitElement, html, css, adoptStyles } from "lit";
import { unselectable } from "../../ui/styles";

export class DraggableHeader extends LitElement {
  static properties = {
    vertical: { type: Boolean },
  };

  static styles = [
    unselectable,
    css`
      .horizontalHeader {
        min-height: 0.5rem;
        writing-mode: horizontal-tb;
      }
      .verticalHeader {
        writing-mode: vertical-lr;
        width: 1rem;
      }
      .header {
        background-color: var(--planager-purple);
        color: var(--planager-text-light);
        pointer-events: all;
        cursor: move;
        display: flex;
        padding: 0.2rem;
        justify-content: space-between;
      }
      #title {
        font-size: 0.7rem;
        font-weight: bolder;
        display: flex;
      }
      #icon-container {
        display: flex;
        align-items: center;
      }
      #icon-slot::slotted(span) {
        display: flex;
      }
      .horizontalHeader slot::slotted(span) {
        margin-left: 0.2rem;
      }
      .verticalHeader slot::slotted(span) {
        margin-top: 0.2rem;
      }
    `,
  ];

  constructor() {
    super();
    this.vertical = false;
  }

  render() {
    return html`<div
      class="unselectable header ${this.vertical
        ? "verticalHeader"
        : "horizontalHeader"}"
    >
      <span id="title"><slot name="title"></slot></span>
      <span id="icon-container"><slot name="icons"></slot></span>
    </div>`;
  }
}
customElements.define("planager-draggable-header", DraggableHeader);
