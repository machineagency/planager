import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class SvgViewer extends Tool {
  static styles = css`
    #imContainer {
      width: 40rem;
      resize: horizontal;
      overflow: auto;
    }
    #im {
      width: 100%;
    }
  `;

  render() {
    return html`<div id="imContainer">
      <img
        id="im"
        src="data:image/svg+xml;base64,${window.btoa(this.inports.svg)}" />
    </div>`;
  }
}
