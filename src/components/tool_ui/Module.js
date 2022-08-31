import { LitElement, html, css } from "lit";
import { repeat } from "lit/directives/repeat.js";
import "./Port";
import "./DraggableHeader";
import { minimize, close } from "../../ui/icons";

export class Module extends LitElement {
  static properties = {
    socket: {},
    handleDown: {},
    handleMove: {},
    layer: { reflect: true },
    dx: {
      reflect: true,
    },
    dy: {
      reflect: true,
    },
    toolid: { reflect: true },
    info: { type: Object },
    minimized: false,
  };

  static styles = css`
    :host {
      position: fixed;
    }
    #module {
      pointer-events: none; // Allows you to click through the transparent div layer, however, you need to re-enable pointer events on the children that need them
      color: var(--planager-text-dark);
      display: grid;
      grid-template-columns: auto auto auto;
    }
    #leftPortsContainer {
      grid-column: 1;
      grid-row: 2;
      height: fit-content;
    }
    #rightPortsContainer {
      grid-column: 3;
      grid-row: 2;
      height: fit-content;
    }
    planager-draggable-header {
      grid-column: 2;
      grid-row: 1;
    }
    #toolContents {
      grid-column: 2;
      grid-row: 2;
      background-color: var(--planager-module-background);
      pointer-events: all;
    }
    #closeIcon {
      display: flex;
    }
    #closeIcon svg:hover {
      fill: var(--planager-red);
      cursor: pointer;
    }
    #closeIcon svg {
      fill: var(--planager-text-light);
      max-height: 1rem;
      margin-left: 0.2rem;
      float: right;
    }
    #minimizeIcon {
      display: flex;
    }
    #minimizeIcon svg:hover {
      fill: var(--planager-orange);
      cursor: pointer;
    }
    #minimizeIcon svg {
      fill: var(--planager-text-light);
      max-height: 1rem;
      margin-left: 1rem;
      float: right;
    }
    .minimized {
      display: none;
    }
    .vertical {
      /* transform: rotate(90deg) translateX(-20px); */
      grid-column: 2;
      grid-row: 2;
    }
  `;
  constructor() {
    super();
    this.info = {};
  }

  toggleMinimize(e) {
    this.minimized = !this.minimized;
    console.log(this.minimized);
  }
  cancel(e) {
    e.stopPropagation();
    return;
  }

  render() {
    return html`<div @pointerdown="${this.cancel}" id="module">
      <planager-draggable-header
        color="orange"
        vertical=${this.minimized}
        class=${this.minimized ? "vertical" : ""}
        @pointerdown="${this.handleDown}"
        @pointermove="${this.handleMove}"
      >
        <span slot="title">${this.info.displayName}</span>
        <span slot="icons" id="minimizeIcon" @click="${this.toggleMinimize}"
          >${minimize}</span
        >
        <span slot="icons" id="closeIcon" @click="${this.handleRemove}"
          >${close}</span
        >
      </planager-draggable-header>
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
      <div id="toolContents" class=${this.minimized ? "minimized" : ""}>
        <slot></slot>
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
    </div>`;
  }
}
customElements.define("planager-module", Module);
