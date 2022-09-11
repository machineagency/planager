import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Text extends Tool {
  static styles = css`
    #text-input {
      font-size: 0.75rem;
      font-family: inherit;
      padding: 0.25rem 0.5rem;
      border: none;
      width: 5rem;
    }

    #text-input:focus {
      outline: 0.2rem solid var(--planager-orange);
      outline-offset: -0.2rem;
    }
  `;

  render() {
    return html`
      <input
        id="text-input"
        type="text"
        value=${this.state.text}
        @input=${(e) => {
          this.state.text = e.target.value;
        }}
      />
    `;
  }
}
