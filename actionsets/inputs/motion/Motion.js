import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class Motion extends Tool {
  isCapturing;
  path;
  points;
  allPaths;

  static styles = css`
    #drawing {
      height: 10rem;
      width: 10rem;
    }
    #controlbox {
      display: flex;
    }
    .button {
      text-align: center;
      width: 50%;
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
    this.isCapturing = false;
    this.points = [];
    this.allPaths = [];
  }

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#drawing");
    this.draw = SVG().addTo(this.canvas).size("100%", "100%");
  }

  beginCapture(e) {
    // Capture is now in progress

    this.isCapturing = true;
    // Calculate the starting point of the click on the canvas
    var rect = this.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    // The first move of the svg is to the starting point
    this.points = [["m", x, y]];

    // SVG is now drawing a path
    this.path = this.draw.path(this.points);

    // Style the path
    this.path.fill("none");
    this.path.stroke({
      color: "var(--planager-pink)",
      width: 4,
      linecap: "round",
      linejoin: "round",
    });
  }
  capture(e) {
    if (!this.isCapturing) return;
    this.points.push(["l", e.movementX, e.movementY]);
    this.path.plot(this.points);
  }
  endCapture(e) {
    if (!this.isCapturing) return;
    this.isCapturing = false;
    // Plot the last bit of the path
    this.points.push(["l", e.movementX, e.movementY]);
    this.path.plot(this.points);
    this.allPaths.push(this.points);
    this.state.paths = this.allPaths;
    // Reset points array
    this.points = [];
  }
  clear(e) {
    this.draw.clear();
  }
  save(e) {
    this.state.paths = this.allPaths;
  }
  render() {
    return this.renderModule(html`<div
        id="drawing"
        @pointermove=${this.capture}
        @pointerdown=${this.beginCapture}
        @pointerup=${this.endCapture}
        @pointerleave=${this.endCapture}
      ></div>
      <div id="controlbox">
        <span class="button" @click=${this.clear}>Clear</span
        ><span class="button" @click=${this.save}>Save</span>
      </div>`);
  }
}
