import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Upload extends Tool {
  static styles = css`
    #button {
      text-align: center;
      width: 100%;
      background-color: var(--planager-blue);
      cursor: pointer;
      color: var(--planager-text-light);
      font-weight: bolder;
    }
    #button:hover {
      filter: brightness(80%);
    }
  `;

  doUpload(e) {
    let f = e.target.files[0];
    let reader = new FileReader();
    reader.onload = ((theFile) => {
      return (e) => {
        console.log(e.target.result);
      };
      reader.readAsText(f);
    })(f);
    // this.state.fileContents = "asdf";
  }

  render() {
    return this.renderModule(
      html`<input
          type="file"
          id="actual-button"
          @change=${this.doUpload}
          hidden
        /><label for="actual-button" id="button">Select File</label>`
    );
  }
}
