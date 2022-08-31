import { LitElement, html, css } from "lit";
import { unselectable } from "../../ui/styles";

export class DraggableHeader extends LitElement {
  static properties = {
    vertical: {},
  };

  static styles = [
    unselectable,
    css`
      #horizontalHeader {
        display: flex;
        justify-content: space-between;
        padding: 0.2rem;
        min-height: 0.5rem;
      }
      #verticalHeader {
        /* height: 30rem; */
        writing-mode: vertical-lr;
      }
      .header {
        background-color: var(--planager-purple);
        color: var(--planager-text-light);
        pointer-events: all;
        cursor: move;
      }
      #title {
        font-size: 0.7rem;
        font-weight: bolder;
      }
      /* .rotated {
        writing-mode: vertical-lr;
      } */
    `,
  ];

  renderVertical() {
    return html`<div id="verticalHeader" class="unselectable header">
      <div id="title"><slot name="title"></slot></div>
      <div>
        <slot name="icons"></slot>
      </div>
    </div>`;
  }

  renderHorizontal() {
    return html`<div id="horizontalHeader" class="unselectable header">
      <span id="title"><slot name="title"></slot></span>
      <slot name="icons"></slot>
    </div>`;
  }
  render() {
    if (this.vertical) {
      return this.renderVertical();
    } else {
      return this.renderHorizontal();
    }
  }
}
customElements.define("planager-draggable-header", DraggableHeader);
