import { LitElement, html, css } from "lit";
import { DataController } from "../../../src/controllers/DataController";

export class PlanagerModuleInput extends LitElement {
  dat = new DataController(this);

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

  setText(e) {
    console.log("set text");
    // this.socket.emit();
  }

  render() {
    return html`
      <div className="background">
        <input
          id="textInput"
          type="text"
          value=${this.dat.state.textValue}
          @change=${this.setText}
        />
      </div>
    `;
  }
}
customElements.define("planager-workspace", PlanagerWorkspace);
