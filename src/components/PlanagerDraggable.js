import { LitElement, html, css } from "lit";

export class PlanagerDraggable extends LitElement {
  static properties = {
    handleDown: {},
    handleMove: {},
    dx: {},
    dy: {},
  };

  static styles = css`
    #draggable-header {
      height: 1.5rem;
      background-color: var(--planager-accent);
      cursor: move;
    }
  `;

  cancel(e) {
    e.stopPropagation();
    return;
  }

  render() {
    return html`<div
      @pointermove="${this.cancel}"
      @pointerdown="${this.cancel}"
    >
      <div
        id="draggable-header"
        @pointerdown="${this.handleDown}"
        @pointermove="${this.handleMove}"
      ></div>
      <slot></slot>
    </div>`;
  }
}
customElements.define("planager-draggable", PlanagerDraggable);
