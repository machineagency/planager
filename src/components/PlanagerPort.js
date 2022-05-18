import { LitElement, html, css } from "lit";

export default class PlanagerPort extends LitElement {
  static properties = {
    side: {},
  };
  static styles = css`
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
  `;

  startConnection(e) {
    const connectionEvent = new CustomEvent("start-connection", {
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
        class="${this.side} port"
        @pointerdown=${this.startConnection}
      ></div>
    `;
  }
}
customElements.define("planager-port", PlanagerPort);
