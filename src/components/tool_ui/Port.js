import { LitElement, html, css } from "lit";

export default class Port extends LitElement {
  static properties = {
    side: { reflect: true },
    info: {},
  };
  constructor() {
    super();
    this.info = {};
  }
  static styles = css`
    .port {
      width: 1rem;
      height: 1rem;
      margin-bottom: 0.2rem;
      background-color: var(--planager-pipe);
      cursor: pointer;
    }
    .port:hover {
      filter: invert(0.5);
    }
    .left {
      border-radius: 50% 0 0 50%;
    }
    .right {
      border-radius: 0 50% 50% 0;
    }
  `;

  handlePortClick(e) {
    const connectionEvent = new CustomEvent("port-click", {
      detail: { mouseX: e.pageX, mouseY: e.pageY },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(connectionEvent);
  }

  render() {
    return html`
      <div
        side=${this.side}
        parent-id=${this.info.parentID}
        class="${this.side} port"
        @pointerdown=${this.handlePortClick}
        title=${this.info.displayName}
      ></div>
    `;
  }
}
customElements.define("planager-port", Port);
