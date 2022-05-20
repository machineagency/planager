import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";
import { ifDefined } from "lit/directives/if-defined.js";

import "@alenaksu/json-viewer";

export default class JsonViewer extends LitElement {
  stateController = new StateController(this);

  static properties = {
    data: { type: Object },
  };

  static styles = css`
    json-viewer {
      /* Background, font and indentation */
      --background-color: #2a2f3a;
      --color: #f8f8f2;
      --font-family: monaco, Consolas, "Lucida Console", monospace;
      --font-size: 1rem;
      --indent-size: 1.5em;
      --indentguide-size: 1px;
      --indentguide-style: solid;
      --indentguide-color: #333;
      --indentguide-color-active: #666;
      --indentguide: var(--indentguide-size) var(--indentguide-style)
        var(--indentguide-color);
      --indentguide-active: var(--indentguide-size) var(--indentguide-style)
        var(--indentguide-color-active);

      /* Types colors */

      --string-color: #a3eea0;
      --number-color: #d19a66;
      --boolean-color: #4ba7ef;
      --null-color: #df9cf3;
      --property-color: #6fb3d2;

      /* Collapsed node preview */
      --preview-color: rgba(222, 175, 143, 0.9);

      /* Search highlight color */
      --highlight-color: #6fb3d2;
    }
  `;

  constructor() {
    super();
    this.data = { hello: { world: "yes" } };
  }

  render() {
    return html`<json-viewer .data=${this.data}></json-viewer> `;
  }
}
