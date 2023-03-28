import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";

import { basicSetup } from "codemirror";

export default class P5Editor extends Tool {
  static styles = css`
    #editorContainer {
      height: 20rem;
      width: 25rem;
    }
    .cm-editor {
      height: inherit;
    }
  `;
  view;

  firstUpdated() {
    this.view = new EditorView({
      doc: this.state.sketch,
      extensions: [
        javascript(),
        basicSetup,
        EditorView.updateListener.of((update) => {
          const sketch = this.view.state.doc.toString();
          this.state.sketch = sketch;
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
