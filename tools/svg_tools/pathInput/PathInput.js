import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class PathInput extends Tool {
  isCapturing;
  path;
  points;
  allPaths;
  startx;
  starty;

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
    this.draw = SVG()
      .addTo(this.canvas)
      .size("100%", "100%")
      .viewbox(0, 0, 50, 50);
  }

  style(path) {
    path.fill("none");
    path.stroke({
      color: "var(--planager-pink)",
      width: 1,
      linecap: "round",
      linejoin: "round",
    });
  }

  beginCapture(e) {
    // Capture is now in progress
    this.isCapturing = true;

    // Calculate the starting point of the click on the canvas
    var rect = this.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    this.startx = x / 2;
    this.starty = y / 2;

    // The first move of the svg is to the starting point
    this.points = ["m", 0, 0];

    // SVG is now drawing a path
    this.path = this.draw
      .path(this.points)
      .attr("transform", `translate(${x / 2},${y / 2})`);

    // Style the path
    this.style(this.path);
  }
  capture(e) {
    if (!this.isCapturing) return;
    // console.log(e.movementX, e.movementY);
    // let vec = new DOMPoint(e.movementX, e.movementY);
    // let svg = this.draw.root().node;
    // vec = vec.matrixTransform(svg.getScreenCTM().inverse());

    this.points.push(...["l", e.movementX / 4, e.movementY / 4]);
    // this.points.push(...["l", vec.x, vec.y]);
    this.path.plot(this.points);
  }
  endCapture(e) {
    if (!this.isCapturing) return;
    this.isCapturing = false;
    // Plot the last bit of the path
    this.points.push(...["l", e.movementX / 4, e.movementY / 4]);

    this.draw.clear();

    let final = this.draw.path(this.points.join(" ")); // ok... if we don't join these with a space to make a path data string, it gets converted to absolute coordinates which we DO NOT WANT

    this.style(final);

    this.state.svg = final.svg();

    final.attr("transform", `translate(${this.startx},${this.starty})`);

    // Reset points array
    this.points = [];
  }
  clear(e) {
    this.draw.clear();
  }
  render() {
    return this.renderModule(html`<div
      id="drawing"
      @pointermove=${this.capture}
      @pointerdown=${this.beginCapture}
      @pointerup=${this.endCapture}
      @pointerleave=${this.endCapture}
    ></div>`);
  }
}
