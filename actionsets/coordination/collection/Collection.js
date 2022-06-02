import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";
export default class Collection extends LitElement {
  p = new StateController(this);

  static styles = css`
    #drawing {
      background-color: var(--planager-workspace-background);
    }
  `;
  grabCandidate(e) {
    console.log(this.p.state.candidate);
  }

  render() {
    return html`<div>${this.p.state.candidate}</div>
      <div id="controlbox">
        <div @click=${this.grabCandidate} id="grab-button">Grab</div>
      </div>`;
  }
}
