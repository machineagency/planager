import { LitElement, html, css } from "lit";
import "../PlanagerDropdown";

export class PlanagerSettings extends LitElement {
  static styles = css``;

  render() {
    return html`<planager-dropdown></planager-dropdown>`;
  }
}
customElements.define("planager-settings", PlanagerSettings);
