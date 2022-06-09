import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import { ToolMouseController } from "../../../src/controllers/ToolMouseController";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class Canvas extends Tool {
  mouse = new ToolMouseController(this);

  static styles = css`
    #drawing {
      width: 20rem;
    }

    .resizable-content {
      resize: horizontal;
      overflow: hidden;
    }
    #controlbox {
      display: flex;
    }
    .button {
      text-align: center;
      width: 5rem;
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
    this.mouse.mouseDown = this.recordLocation.bind(this);
  }

  get canvasLocation() {
    return {
      x: (this.mouse.pos.xRatio * this.state.width).toPrecision(4),
      y: (this.mouse.pos.yRatio * this.state.height).toPrecision(4),
    };
  }

  recordLocation() {
    this.state.currentMark = this.canvasLocation;
  }

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#drawing");
    this.mouse.setTrackedElement(this.canvas);
    this.draw = SVG().addTo(this.canvas).size("100%", "100%");
  }

  clear() {
    this.draw.clear();
  }

  render() {
    return this.renderModule(html` <div id="controlbox">
        <span class="button" @click=${this.clear}>Clear</span>
        <span>X: ${this.canvasLocation.x}</span>
        <span>Y: ${this.canvasLocation.y}</span>
      </div>
      <div
        id="drawing"
        style="aspect-ratio:${this.state.width} / ${this.state.height}"
        class="resizable-content"
      ></div>`);
  }
}
