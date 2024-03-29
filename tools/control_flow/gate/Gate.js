import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Gate extends Tool {
  static styles = css`
    .gate {
      padding: 0.5rem;
      color: var(--planager-text-light);
      font-size: 1rem;
      text-align: center;
      cursor: pointer;
      width: 4rem;
      font-weight: bolder;
    }

    .open {
      background-color: var(--planager-blue);
    }

    .closed {
      background-color: var(--planager-red);
    }
  `;

  render() {
    return html`<div
      class=${`gate ${this.state.open ? "open" : "closed"}`}
      @click=${() => (this.state.open = !this.state.open)}
    >
      ${this.state.open ? "Open" : "Closed"}
    </div>`;
  }
}
