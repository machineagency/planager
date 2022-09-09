import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class PlanagerTextInput extends Tool {
  static styles = css`
    #textInput {
      font-size: 16px;
      font-size: max(16px, 1em);
      font-family: inherit;
      padding: 0.25em 0.5em;
      border: none;
      width: 5rem;
    }

    #textInput:focus {
      outline: 5px solid var(--planager-orange);
      outline-offset: -5px;
    }
  `;

  render() {
    return this.renderModule(html`
      <input
        id="textInput"
        type="text"
        value=${this.state.text}
        @input=${(e) => {
          this.state.text = e.target.value;
        }}
      />
    `);
  }
}
