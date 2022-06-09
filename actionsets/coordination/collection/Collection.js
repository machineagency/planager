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
    this.api.runMethod("grab");
  }

  render() {
    return this.renderModule(html`<div>
        ${JSON.stringify(this.inports["candidate"])} ${this.inports["name"]}
      </div>
      <div id="controlbox">
        <div @click=${this.grabCandidate} id="grab-button">Grab</div>
      </div>`);
  }
}
