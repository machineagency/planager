import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "./PlanagerPort";

export class PlanagerModule extends LitElement {
  static properties = {
    handleDown: {},
    handleMove: {},
    dx: { reflect: true },
    dy: { reflect: true },
    info: { type: Object },
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
  constructor() {
    super();
    this.info = {};
  }
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
