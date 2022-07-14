import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import {
  SVG,
  extend as SVGextend,
  Element as SVGElement,
} from "@svgdotjs/svg.js";

export default class AxiPlanner extends Tool {
  static styles = css`
    #drawing {
      width: 10rem;
    }

    .resizable-content {
      resize: horizontal;
      overflow: hidden;
    }
  `;

  firstUpdated() {
    this.canvas = this.renderRoot.querySelector("#drawing");
    this.draw = SVG().addTo(this.canvas).size("100%", "100%");
  }

  render() {
    if (this.draw && this.state.paths) {
      console.log(this.state.paths);
      this.draw.clear();
      for (const path of this.state.paths) {
        this.path = this.draw.path([]);

        // Style the path
        this.path.fill("none");
        this.path.stroke({
          color: "var(--planager-pink)",
          width: 4,
          linecap: "round",
          linejoin: "round",
        });
        this.path.plot(path);
      }

      // for (let x = 0; x < 5; x++) {
      //   for (let y = 0; y < 5; y++) {
      //     this.path = this.draw.path([]);

      //     // Style the path
      //     this.path.fill("none");
      //     this.path.stroke({
      //       color: "var(--planager-pink)",
      //       width: 4,
      //       linecap: "round",
      //       linejoin: "round",
      //     });

      //     let wholeCommand = [["m", x * 20, y * 20]].concat(
      //       this.inports.stroke
      //     );
      //     allCommands.push(wholeCommand);
      //     this.path.plot(wholeCommand);
      //   }
      // }
    }
    return this.renderModule(html`<div id="drawing"></div>`);
  }
}
