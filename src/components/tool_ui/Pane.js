import { LitElement, html, css } from "lit";
import "./DraggableHeader";

export class Pane extends LitElement {
  static properties = {
    dx: { reflect: true },
    dy: { reflect: true },
    displayName: { reflect: true },
  };

  static styles = css`
    #pane {
      background-color: var(--planager-module-background);
      box-shadow: 0.2rem 0.2rem;
    }
    #icon {
      display: flex;
    }
    #icon:hover ::slotted(svg) {
      fill: var(--planager-orange);
    }
  `;

  constructor() {
    super();
    this.dx = 500;
    this.dy = 500;
    this.displayName = "unnamed";
  }

  cancel(e) {
    e.stopPropagation();
    return;
  }

  render() {
    return html`<div @pointerdown="${this.cancel}" id="pane">
      <planager-draggable-header
        @pointerdown="${this.handleDown}"
        @pointermove="${this.handleMove}"
        ><span slot="title"
          >${this.displayName}</span
        ></planager-draggable-header
      >
      <slot></slot>
    </div>`;
  }
}
customElements.define("planager-pane", Pane);
