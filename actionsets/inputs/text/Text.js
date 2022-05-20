import { LitElement, html, css } from "lit";
import { MessageController } from "../../../src/controllers/MessageController";

export default class PlanagerTextInput extends LitElement {
  messenger = new MessageController(this);

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

  handleInput(e) {
    this.messenger.updateBackend("textValue", e.target.value);
  }

  render() {
    return html`
      <input id="textInput" type="text" @input=${this.handleInput} />
    `;
  }
}
