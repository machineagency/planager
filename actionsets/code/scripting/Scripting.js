import { html, css, nothing } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Scripting extends Tool {
  static styles = css``;

  render() {
    let variableMap = nothing;
    if (this.inports.vars) {
      variableMap = repeat(
        Object.entries(this.inports.vars),
        (item) => item[0],
        (inportVars) =>
          html`<div>ID:${inportVars[0]}, val:${inportVars[1]}</div>`
      );
    }
    return this.renderModule(html`${variableMap}
      <textarea id="w3review" rows="4" cols="50">
    print("hello world!")
    </textarea
      >`);
  }
}
