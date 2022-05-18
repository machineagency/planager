import { LitElement, html, css } from "lit";
import "./PlanagerPort";

export class PlanagerModule extends LitElement {
  static properties = {
    handleDown: {},
    handleMove: {},
    dx: { reflect: true },
    dy: { reflect: true },
  };

  static styles = css`
    #draggable-header {
      height: 1rem;
      background-color: var(--planager-accent);
      cursor: move;
    }
    #leftPortsContainer {
      position: absolute;
      left: -1rem;
    }
    #rightPortsContainer {
      position: absolute;
      right: -1rem;
    }
  `;

  cancel(e) {
    e.stopPropagation();
    return;
  }

  render() {
    return html`<div @pointerdown="${this.cancel}">
      <div
        id="draggable-header"
        @pointerdown="${this.handleDown}"
        @pointermove="${this.handleMove}"
      ></div>
      <div id="leftPortsContainer">
        <planager-port side="left"></planager-port>
      </div>
      <div id="rightPortsContainer">
        <planager-port side="right"></planager-port>
      </div>
      <slot></slot>
    </div>`;
  }
}
customElements.define("planager-module", PlanagerModule);
