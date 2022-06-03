import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Collection extends Tool {
  static styles = css`
    #controlbox {
      background-color: var(--planager-module-background);
    }
    #grab-button {
      cursor: pointer;
    }
  `;
  grabCandidate(e) {
    console.log(this.state.candidate);
  }

  render() {
    return this.renderModule(html`<div>${this.state.candidate}</div>
      <div id="controlbox">
        <div @click=${this.grabCandidate} id="grab-button">Grab</div>
      </div>`);
  }
}
