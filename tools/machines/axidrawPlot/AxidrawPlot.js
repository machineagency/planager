import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class AxidrawPlot extends Tool {
  static styles = css`
    .button {
      background-color: var(--planager-blue);
      color: var(--planager-text-light);
      padding: 0.2rem 0.5rem;
      text-align: center;
    }
    .button:hover {
      background-color: var(--planager-workspace-background);
      cursor: pointer;
    }
    #control-container {
      grid-template-columns: auto auto auto;
      display: grid;
      font-size: 0.75rem;
      color: var(--planager-text-light);
      user-select: none;
    }
  `;
  render() {
    return this.renderModule(html`
      <div
        class="button"
        @click=${(e) => this.api.runMethod("preview")}>
        Generate preview
      </div>
      <div
        class="button"
        @click=${(e) => this.api.runMethod("run")}>
        Run!
      </div>
    `);
  }
}
