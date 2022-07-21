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

  async doUpload(e) {
    let file = e.target.files[0];
    this.state.fileType = file.type;
    this.state.fileSize = file.size;
    this.state.fileName = file.name;
    this.state.fileURL = URL.createObjectURL(file);
    this.state.fileContents = await file.text();
    // console.log(file.text());

    // let contents;
    // const reader = new FileReader();
    // reader.onload = (function (c) {
    //   return function (e) {
    //     console.log(e.target.result);
    //   };
    // })(contents);
    // reader.readAsDataURL(file);
    // console.log(contents);
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
