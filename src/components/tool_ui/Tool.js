import { LitElement, html, css } from "lit";
import { StateController } from "../../controllers/StateController";
import "./StatePane";

export class Tool extends LitElement {
  static properties = {
    info: {},
    state: {},
  };

  static styles = css`
    #state-drawer {
      background-color: var(--planager-module-background);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.state = new StateController(this).state;
  }

  renderStatePane() {
    return html`<state-pane .state=${{ ...this.state }}></state-pane>`;
  }

  renderModule(content) {
    return [content, this.renderStatePane()];
  }
}
