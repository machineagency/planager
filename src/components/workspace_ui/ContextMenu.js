import { LitElement, html, css } from "lit";

export class ContextMenu extends LitElement {
  static styles = css`
    #context-menu {
      position: absolute;
      z-index: 150;
      right: 0;
      height: 100%;
    }
  `;
  render() {
    return html`
      <div id="context-menu">
        <button>add action</button>
        <button>add action</button>
        <button>add action</button>
        <button>add action</button>
        <button>add action</button>
      </div>
    `;
  }
}
customElements.define("planager-context-menu", ContextMenu);
