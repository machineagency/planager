import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Text extends Tool {
  static styles = css`
    #text-input {
      font-size: 0.75rem;
      font-family: inherit;
      caret-color: var(--planager-workspace-background);
      background-color: var(--planager-module-background);
      color: var(--planager-text-dark);
      min-width: 4rem;
      max-width: 20rem;
      padding: 0.25rem 0.5rem;
      overflow: auto;
      resize: both;
      white-space: pre-line;
    }

    #text-input:focus {
      outline: 0.2rem solid var(--planager-blue);
      outline-offset: -0.1rem;
    }

    #text-input:empty:focus::before,
    #text-input:empty::before {
      content: "type...";
      font-style: italic;
      color: var(--planager-gray);
    }
  `;

  render() {
    return html`
      <div
        id="text-input"
        role="textbox"
        contenteditable
        @input=${(e) => {
          this.state.text = e.target.innerText;
        }}
      ></div>
    `;
  }
}
