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
      width: 8.5in;
      height: 5.5in;
      /* padding: 1rem;
      background-color: var(--planager-workspace-background); */
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
    this.api.runMethod("capture_position", {
      x: this.mouse.pos.x,
      y: this.mouse.pos.y,
    });
  }

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#drawing");
    this.mouse.setTrackedElement(this.canvas);
    this.draw = SVG()
      .addTo(this.canvas)
      .size("17in", "11in")
      .viewbox("0 0 34 22");

    this.draw.attr({ preserveAspectRatio: "xMinYMin" });

    let rec = this.draw.rect(17, 11);
    this.draw.rect(1, 1).fill("#f06").move(2, 2);
    rec.click((e) => {
      console.log(e);
      var p = this.draw.createSVGPoint();
      p.x = e.clientX;
      p.y = e.clientY;
      var ctm = this.draw.getScreenCTM().inverse();
      var p = p.matrixTransform(ctm);
      return p;
    });
  }

  render() {
    if (this.draw && this.inports.objects) {
      this.draw.clear();
      for (const [key, obj] of Object.entries(this.inports.objects)) {
        this.draw.svg(obj);
      }
    }
    return this.renderModule(html`
      <div id="controlbox">
        <span>X: ${this.mouse.pos.x}</span>
        <span>Y: ${this.mouse.pos.y}</span>
      </div>
      <!-- <div id="drawing" class="resizable-content"></div> -->
      <!-- <div id="drawing"></div> -->

      <!-- https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/ -->

      <div
        id="drawing"
        style="aspect-ratio:${this.state.width} / ${this.state.height}"
        class="resizable-content"
      ></div>
    `);
  }
}
