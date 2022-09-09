import { LitElement, html, css } from "lit";

export default class Port extends LitElement {
  static properties = {
    side: { reflect: true },
    portid: { reflect: true },
    info: {},
    // pipe: { reflect: true },
  };
  constructor() {
    super();
    this.info = {};
    // this.pipe = { x: null, y: null };
  }
  static styles = css`
    .port {
      width: fit-content;
      height: 1rem;
      margin-bottom: 0.2rem;
      background-color: var(--planager-pipe);
      cursor: pointer;
      color: var(--planager-text-dark);
      font-size: x-small;
      font-family: monospace;
      clear: both;
      pointer-events: all;
    }
    .port:hover {
      background-color: var(--planager-green);
    }
    .left {
      border-radius: 0.5rem 0 0 0.5rem;
      float: right;
    }
    .right {
      border-radius: 0 0.5rem 0.5rem 0;
      float: left;
    }
    .text {
      vertical-align: sub;
      margin: auto 0.2rem;
    }
  `;

  // firstUpdated() {
  //   this.pipeAttachmentPoint();
  // }

  // pipeAttachmentPoint() {
  //   const rect = this.renderRoot
  //     .querySelector("#portui")
  //     .getBoundingClientRect();

  //   this.pipe.x = rect.left + (this.side == "right" ? rect.width - 5 : 5);
  //   this.pipe.y = rect.top + rect.height / 2;
  // }

  handlePortClick(e) {
    // this.pipeAttachmentPoint();
    const connectionEvent = new CustomEvent("port-click", {
      detail: {
        mouseX: e.pageX,
        mouseY: e.pageY,
      },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(connectionEvent);
  }

  render() {
    return html`
      <div
        id="portui"
        side=${this.side}
        parent-id=${this.info.parentID}
        class="${this.side} port"
        @pointerdown=${this.handlePortClick}
        title=${this.info.displayName}
      >
        <span class="text">${this.info.displayName}</span>
      </div>
    `;
  }
}
customElements.define("planager-port", Port);
