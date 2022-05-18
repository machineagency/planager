import { LitElement, html, css } from "lit";

export default class PlanagerPipe extends LitElement {
  static properties = {
    start: { reflect: true, type: Object },
    end: { reflect: true, type: Object },
  };

  static styles = css`
    #pipe {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: -1;
    }

    #pipePath {
      stroke: var(--base1);
      stroke-width: 3px;
      fill: none;
    }
  `;

  calculateBezier() {
    return `M${this.start.x},${this.start.y}
    C${this.start.x + 100},${this.start.y}
    ${this.end.x - 100},${this.end.y}
    ${this.end.x},${this.end.y}`;
  }

  render() {
    return html`
      <svg id="pipe">
        <path id="pipePath" d=${this.calculateBezier()} />
      </svg>
    `;
  }
}
customElements.define("planager-pipe", PlanagerPipe);
