import { LitElement, html, css } from "lit";
import { DataController } from "../../../src/controllers/DataController";

export default class DataViewer extends LitElement {
  dat = new DataController(this);

  static styles = css`
    #dataViewerUI {
      padding: 10px;
      background-color: var(--base03);
      max-height: 500px;
      max-width: 500px;
      overflow: auto;
      scrollbar-width: thin;
      min-width: 300px;
    }
  `;

  handleInput(e) {
    console.log(e.target.value);
  }

  render() {
    return html`
      <div id="dataViewerUI">
        <!-- <ReactJson
          theme="solarized"
          name="{false}"
          src="{chooseSrc(action.inports.data.value)}"
          collapsed="{collapsed}"
          dataTypes="{dataTypes}"
          enableClipboard="{false}"
        /> -->
      </div>
    `;
  }
}
