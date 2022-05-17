import { LitElement, html, css } from "lit";

export default class PlanagerPipe extends LitElement {
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
    let x1 = this.startX;
    let y1 = this.startY;
    let x2 = this.endX;
    let y2 = this.endY;

    return `M${x1},${y1}
    C${x1 + 100},${y1}
    ${x2 - 100},${y2}
    ${x2},${y2}`;
  }

  render() {
    return html`
      <svg id="pipe">
        <path id="pipePath" d=${this.calculateBezier} />
      </svg>
    `;
  }
}
customElements.define("planager-pipe", PlanagerPipe);
