import { LitElement, html, css } from "lit";

export class PlanagerModule extends LitElement {
  static properties = {
    handleDown: {},
    handleMove: {},
    dx: {},
    dy: {},
  };

  static styles = css`
    #draggable-header {
      height: 1rem;
      background-color: var(--planager-accent);
      cursor: move;
    }
    .port {
      width: 1rem;
      height: 1rem;
      margin-bottom: 0.2rem;
      cursor: pointer;
    }
    .port:hover {
      background-image: linear-gradient(rgba(0, 0, 0, 0.3) 0 0);
    }
    .left {
      border-radius: 50% 0 0 50%;
      background-color: var(--green);
    }
    .right {
      border-radius: 0 50% 50% 0;
      background-color: var(--violet);
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

  connection(e) {
    let coords = e.target.getBoundingClientRect();
    this.handlePipe({
      startx: coords.left + coords.width / 2,
      starty: coords.top + coords.height / 2,
    });
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
      <div id="leftPortsContainer">
        <div class="left port" @pointerdown=${this.connection}></div>
        <div class="left port" @pointerdown=${this.connection}></div>
      </div>
      <div id="rightPortsContainer">
        <div class="right port" @pointerdown=${this.connection}></div>
        <div class="right port" @pointerdown=${this.connection}></div>
      </div>
      <slot></slot>
    </div>`;
  }
}
customElements.define("planager-module", PlanagerModule);
