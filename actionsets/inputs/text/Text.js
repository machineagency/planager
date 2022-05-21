import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";

export default class PlanagerTextInput extends LitElement {
  p = new StateController(this);

  static styles = css`
    #textInput {
      font-size: 16px;
      font-size: max(16px, 1em);
      font-family: inherit;
      padding: 0.25em 0.5em;
      background-color: var(--planager-foreground);
      border: none;
    }

    #textInput:focus {
      outline: 5px solid var(--planager-accent);
      outline-offset: -5px;
    }
  `;

  render() {
    return html`
      <input
        id="textInput"
        type="text"
        value=${this.p.state.text}
        @input=${(e) => {
          this.p.state.text = e.target.value;
        }}
      />
    `;
  }
}
