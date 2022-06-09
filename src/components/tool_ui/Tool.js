import { LitElement, html, css } from "lit";
import { StateController } from "../../controllers/StateController";
import { MethodController } from "../../controllers/MethodController";
import { PortDataController } from "../../controllers/PortDataController";
import "./StatePane";

export class Tool extends LitElement {
  ports = new PortDataController(this);
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
    this.api = new MethodController(this);
    this.inports = this.ports.inports;
    this.outports = this.ports.outports;
  }

  renderStatePane() {
    return html`<state-pane .state=${{ ...this.state }}></state-pane>`;
  }

  renderModule(content) {
    return [content, this.renderStatePane()];
  }
}
