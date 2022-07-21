import { LitElement, html, css, adoptStyles } from "lit";
import { StateController } from "../../../src/controllers/StateController";

import "@alenaksu/json-viewer";

export default class JsonViewer extends LitElement {
  p = new StateController(this);

  static styles = css`
    #viewer {
      min-width: 10rem;
      padding: 0.5rem;
      overflow: auto;
    }
    json-viewer {
      /* Background, font and indentation */
      --background-color: var(--planager-toolbar);
      --color: var(--planager-foreground2);
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
      --string-color: var(--planager-green);
      --number-color: var(--planager-orange);
      --boolean-color: var(--planager-blue);
      --null-color: var(--planager-purple);
      --property-color: var(--planager-cyan);

      /* Collapsed node preview */
      --preview-color: var(--base1);

      /* Search highlight color */
      --highlight-color: #6fb3d2;
    }
  `;

  firstUpdated() {
    this.viewer = this.renderRoot.querySelector("json-viewer");
    const styles = css`
      ul {
        margin: 0;
        max-height: 30rem;
        max-width: 30rem;
      }
    `;
    // This is how we inject styles to the child's shadow root
    adoptStyles(this.viewer.shadowRoot, [styles]);
  }

  render() {
    return html`<json-viewer
      id="viewer"
      .data=${this.p.state.jsonData ? this.p.state.jsonData : {}}
      >{}
    </json-viewer> `;
  }
}
