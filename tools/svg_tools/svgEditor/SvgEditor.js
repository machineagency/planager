import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class ImageViewer extends Tool {
  isCapturing;
  path;
  points;
  allPaths;

  static styles = css`
    #drawing {
      height: 22rem;
      width: 34rem;
      min-width: -moz-available;
    }

    .resizable-content {
      resize: both;
      overflow: hidden;
    }
    #controlbox {
      display: flex;
    }
    .button {
      text-align: center;
      width: 100%;
      background-color: var(--planager-blue);
      cursor: pointer;
      color: var(--planager-text-light);
      font-weight: bolder;
    }
    .button:hover {
      filter: brightness(80%);
    }
  `;
  constructor() {
    super();
  }

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#drawing");
    this.draw = SVG().addTo(this.canvas).size("100%", "100%");
  }

  clear() {
    this.draw.clear();
  }

  render() {
    let parser = new DOMParser();
    if (this.state.svgContents) {
      // console.log(this.state.svgContents);
      const doc = parser.parseFromString(
        this.state.svgContents,
        "image/svg+xml"
      );
      this.draw.svg(this.state.svgContents);
    }
    return this.renderModule(html`<div id="controlbox">
        <span class="button" @click=${this.clear}>Clear</span>
      </div>
      <div id="drawing" class="resizable-content"></div>`);
  }
}
