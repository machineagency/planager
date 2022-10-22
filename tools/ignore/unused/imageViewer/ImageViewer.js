import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class ImageViewer extends Tool {
  static styles = css`
    .resizable {
      resize: horizontal;
      overflow: auto;
      width: 15rem;
    }
    img {
      display: block;
      margin: auto;
      width: 100%;
    }
  `;

  render() {
    return this.renderModule(
      html`<div class="resizable"><img src=${this.state.imageURL} /></div>`
    );
  }
}
