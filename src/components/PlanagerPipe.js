import { LitElement, html, css } from "lit";

export default class PlanagerPipe extends LitElement {
  static properties = {
    start: { reflect: true, type: Object },
    end: { reflect: true, type: Object },
    startparentid: { reflect: true },
    startportid: { reflect: true },
    endparentid: { reflect: true },
    endportid: { reflect: true },
    dx: { type: Number },
    dy: { type: Number },
    scaleFactor: { type: Number },
  };

  static styles = css`
    :host {
      display: contents;
    }
    #pipe {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }

    #pipePath {
      stroke: var(--planager-pipe);
      stroke-width: 3px;
      fill: none;
    }
  `;

  constructor() {
    super();
    this.dx = 0;
    this.dy = 0;
    this.scaleFactor = 1;
    this.startparentid = "";
    this.startportid = "";
    this.endparentid = "";
    this.endportid = "";
  }

  calculateBezier() {
    return `M${this.start.x},${this.start.y}
    C${this.start.x + 100},${this.start.y}
    ${this.end.x - 100},${this.end.y}
    ${this.end.x},${this.end.y}`;
  }

  render() {
    return html`
      <svg id="pipe">
        <path
          id="pipePath"
          d=${this.calculateBezier()}
          transform="translate(${this.dx}, ${this.dy})"
        />
      </svg>
    `;
  }
}
customElements.define("planager-pipe", PlanagerPipe);
