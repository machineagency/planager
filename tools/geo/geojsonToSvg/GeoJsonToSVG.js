import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import { createRef, ref } from "lit/directives/ref.js";

import * as d3 from "d3";

export default class GeoJsonToSvg extends Tool {
  // static styles = css`
  //   #map-container {
  //     height: 30rem;
  //     width: 30rem;
  //   }
  // `;
  mapContainer = createRef();
  map;

  firstUpdated() {
    let el = this.shadowRoot.querySelector("#map");
    this.map = d3
      .select(el)
      .append("svg")
      .attr("width", 200)
      .attr("height", 200);
    this.map.append("circle").attr("cx", 100).attr("cy", 100).attr("r", 7);
  }

  updateMap() {
    if (!this.map) return;
    this.map
      .append("g")
      .selectAll("path")
      .data(geoJsonObj.features)
      .enter()
      .append("path")
      .attr("d", path);
  }

  render() {
    this.updateMap();
    return this.renderModule(html`<div>
      <div
        id="map-container"
        ${ref(this.mapContainer)}></div>
      <div id="map"></div>
    </div>`);
  }
}
