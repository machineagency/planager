import { LitElement, html, css } from "lit";
import "./PlanagerDropdown";
import "./PlanagerDraggableHeader";

export class PlanagerSettings extends LitElement {
  static properties = {
    dx: { reflect: true },
    dy: { reflect: true },
  };
  static styles = css`
    #pane {
      background-color: var(--planager-module-background);
    }
  `;
  constructor() {
    super();
    this.dx = 500;
    this.dy = 500;
  }

  cancel(e) {
    e.stopPropagation();
    return;
  }

  render() {
    return html`<div id="pane" @pointerdown=${this.cancel}>
      <planager-draggable-header
        @pointerdown=${this.handleDown}
        @pointermove=${this.handleMove}
        >Settings</planager-draggable-header
      >
      <div id="content">
        <planager-dropdown></planager-dropdown>
      </div>
    </div>`;
  }
}
customElements.define("planager-settings", PlanagerSettings);
