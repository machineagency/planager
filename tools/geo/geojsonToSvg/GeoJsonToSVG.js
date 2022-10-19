import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import * as d3 from "d3";

export default class GeoJsonToSvg extends Tool {
  static styles = css`
    #map {
      display: block;
    }
    #map path {
      stroke: #333;
      fill: none;
    }
  `;

  updateMap() {
    if (!this.inports.geojson) return;
    let features = this.inports.geojson;
    let projection = d3.geoEquirectangular();
    projection.fitExtent(
      [
        [0, 0],
        [400, 400],
      ],
      {
        type: "FeatureCollection",
        features: features,
      }
    );
    let geoGenerator = d3.geoPath().projection(projection);

    let map = d3.select(this.shadowRoot.querySelector("#map"));

    map.selectAll("g").remove();

    map
      .append("g")
      .selectAll("path")
      .data(features)
      .enter()
      .append("path")
      .attr("d", geoGenerator);
  }

  render() {
    this.updateMap();
    return this.renderModule(html`<div>
      <svg
        id="map"
        width="400px"
        height="400px"></svg>
    </div>`);
  }
}
