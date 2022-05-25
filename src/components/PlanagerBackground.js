import { LitElement, html, css } from "lit";

export default class PlanagerBackground extends LitElement {
  static styles = css`
    :host {
      --grid-size: 2rem;
      --grid-dot-size: 1px;
    }
    canvas {
      background-size: calc(var(--grid-size) * var(--scaleFactor, 1))
        calc(var(--grid-size) * var(--scaleFactor, 1));
      background-image: radial-gradient(
        circle,
        var(--planager-module-background) var(--grid-dot-size),
        var(--planager-workspace-background) var(--grid-dot-size)
      );
      background-position: var(--offset-x, 0) var(--offset-y, 0);
      z-index: 0;
      width: 100%;
      height: 100%;
      position: fixed;
    }
  `;

  render() {
    return html`<canvas></canvas> `;
  }
}
customElements.define("planager-background", PlanagerBackground);
