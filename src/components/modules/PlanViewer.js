import { LitElement, html, css, adoptStyles } from "lit";
import "@alenaksu/json-viewer";

export class PlanagerPane extends LitElement {
  static properties = {
    plan: { type: Object },
  };
  static styles = css`
    #viewer {
      min-width: 10rem;
      padding: 0.5rem;
      overflow: auto;
    }
    json-viewer {
      --string-color: var(--planager-green);
      --number-color: var(--planager-orange);
      --boolean-color: var(--planager-blue);
      --null-color: var(--planager-purple);
      --property-color: var(--planager-cyan);
    }
  `;
  constructor() {
    super();
    this.plan = {};
  }
  connectedCallback() {
    super.connectedCallback();
    this.socket.emit("getPlan", (message) => {
      this.plan = message;
      this.requestUpdate();
    });
    this.socket.on(`planUpdate`, (message) => {
      this.plan = message;
      this.requestUpdate();
    });
  }
  firstUpdated() {
    this.viewer = this.renderRoot.querySelector("json-viewer");
    const styles = css`
      ul {
        margin: 0;
        max-height: 30rem;
        max-width: 30rem;
      }
    `;
    // This is how we inject styles to the child's shadow root
    adoptStyles(this.viewer.shadowRoot, [styles]);
  }
  render() {
    return html`<json-viewer id="viewer" .data=${this.plan}></json-viewer>`;
  }
}
customElements.define("plan-viewer", PlanagerPane);
