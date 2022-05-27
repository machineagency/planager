import { LitElement, html, css } from "lit";
import { StateController } from "../../../src/controllers/StateController";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class SvgEditor extends LitElement {
  p = new StateController(this);
  isCapturing;
  path;
  points;
  allPaths;

  static styles = css`
    #drawing {
      height: 22rem;
      width: 34rem;
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
    return html` <div id="controlbox">
        <span class="button" @click=${this.clear}>Clear</span>
      </div>
      <div id="drawing" class="resizable-content"></div>`;
  }
}
