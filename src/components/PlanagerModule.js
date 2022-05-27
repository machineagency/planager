import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "./PlanagerPort";
import "./PlanagerDraggableHeader";

export class PlanagerModule extends LitElement {
  static properties = {
    socket: {},
    handleDown: {},
    handleMove: {},
    dx: { reflect: true },
    dy: { reflect: true },
    info: { type: Object },
  };

  static styles = css`
    #module {
      border: 1px solid var(--planager-purple);
      background-color: var(--planager-module-background);
      color: var(--planager-text-dark);
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
  constructor() {
    super();
    this.info = {};
  }
  cancel(e) {
    e.stopPropagation();
    return;
  }

  render() {
    return html`<div @pointerdown="${this.cancel}" id="module">
      <planager-draggable-header
        color="orange"
        @pointerdown="${this.handleDown}"
        @pointermove="${this.handleMove}"
        >${this.info.displayName}</planager-draggable-header
      >
      <div id="leftPortsContainer">
        ${repeat(
          Object.values(this.info.inports),
          (inport) => inport.id,
          (inport, index) =>
            html`
              <planager-port
                side="left"
                .info=${inport}
                .portid=${inport.id}
                .parentid=${inport.parentID}
              ></planager-port>
            `
        )}
      </div>
      <div id="rightPortsContainer">
        ${repeat(
          Object.values(this.info.outports),
          (outport) => outport.id,
          (outport, index) =>
            html`
              <planager-port
                side="right"
                .info=${outport}
                .portid=${outport.id}
                .parentid=${outport.parentID}
              ></planager-port>
            `
        )}
      </div>
      <slot></slot>
    </div>`;
  }
}
customElements.define("planager-module", PlanagerModule);
