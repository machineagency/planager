import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
// import { ToolMouseController } from "../../../src/controllers/ToolMouseController";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class Canvas extends Tool {
  // mouse = new ToolMouseController(this);

  static styles = css`
    #svg-canvas {
      background-color: var(--planager-module-background);
    }

    #svg-container {
      width: 40rem;
      padding: 1rem;
      background-color: var(--planager-workspace-background);
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

  recordLocation(e) {
    let svg = this.draw.root().node;
    let point = new DOMPoint(e.layerX, e.layerY);
    let coords = point.matrixTransform(svg.getScreenCTM().inverse());
    this.api.runMethod("capture_position", {
      x: coords.x,
      y: coords.y,
    });
  }

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#svg-canvas");
    // this.mouse.setTrackedElement(this.canvas);

    this.draw = SVG(this.canvas).viewbox(
      `0 0 ${this.state.width} ${this.state.height}`
    );

    this.draw.root().click((e) => this.recordLocation(e));
  }

  render() {
    if (this.draw) {
      this.draw.viewbox(`0 0 ${this.state.width} ${this.state.height}`);
    }
    if (this.draw && this.inports.objects) {
      this.draw.clear();
      for (const [key, obj] of Object.entries(this.inports.objects)) {
        if (Array.isArray(obj)) {
          for (const pathStr of obj) {
            let pathTemp = SVG(pathStr);

            this.draw.add(pathTemp);
          }
        } else {
          this.draw.svg(obj);
        }
      }
    }
    return this.renderModule(html`
      <div id="svg-container">
        <svg id="svg-canvas"></svg>
      </div>
    `);
  }
}
