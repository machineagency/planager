import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json";

import { basicSetup } from "codemirror";

export default class MapConfig extends Tool {
  static styles = css``;
  view;

  firstUpdated() {
    this.view = new EditorView({
      doc: JSON.stringify(this.state.config, null, 2),
      extensions: [
        json(),
        basicSetup,
        EditorView.updateListener.of((update) => {
          const conf = JSON.parse(this.view.state.doc.toString());
          this.state.config = conf;
        }),
      ],
      parent: this.shadowRoot.querySelector("#editorContainer"),
    });
  }

  render() {
    return html`
      <div
        id="editorContainer"></div>
      </div>
    `;
  }
}
