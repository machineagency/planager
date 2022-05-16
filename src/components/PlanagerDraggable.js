import { LitElement, html, css } from "lit";

export class PlanagerDraggable extends LitElement {
  static properties = {
    handleDown: {},
    handleMove: {},
    dx: {},
    dy: {},
  };

  static styles = css`
    #draggable {
      position: absolute;
      background-color: var(--planager-foreground2);
      color: var(--planager-background);
      height: 5rem;
      width: 5rem;
    }
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

  // constructor() {
  //   super();
  // }

  render() {
    return html`<div
      id="draggable"
      @pointermove="${this.cancel}"
      @pointerdown="${this.cancel}"
    >
      <div
        id="draggable-header"
        @pointerdown="${this.handleDown}"
        @pointermove="${this.handleMove}"
      ></div>
      <slot name="draggable-body"></slot>
    </div>`;
  }
}
customElements.define("planager-draggable", PlanagerDraggable);
