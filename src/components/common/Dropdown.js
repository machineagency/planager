import { LitElement, html, css } from "lit";
import { unselectable } from "../../ui/styles";

export class Dropdown extends LitElement {
  static styles = [
    unselectable,
    css`
      .dropdown {
        display: inline-block;
        position: relative;
      }
      .dropdown-content {
        display: none;
        position: absolute;
        width: 100%;
        overflow: auto;
        background-color: var(--planager-module-background);
        outline: 1px solid var(--planager-purple);
      }
      .dropdown:hover .dropdown-content {
        display: block;
      }
      .dropdown-content div {
        color: #000000;
        padding: 0.25rem;
      }
      .dropdown-content div:hover {
        color: var(--planager-text-light);
        background-color: var(--planager-blue);
      }
    `,
  ];

  render() {
    return html`
      <div class="dropdown unselectable">
        Color Theme
        <div class="dropdown-content">
          <div>solarized</div>
          <div>dracula</div>
          <div>solarized</div>
        </div>
      </div>
    `;
  }
}
customElements.define("planager-dropdown", Dropdown);
