import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import * as d3 from "d3";

// import {geo}

// import

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
    if (!this.inports.bounds) return;

    let features = this.inports.geojson;
    const bounds = this.inports.bounds;

    let projection = d3
      .geoEquirectangular()
      .center([
        (bounds._sw.lng - bounds._ne.lng) / 2,
        (bounds._sw.lat - bounds._ne.lat) / 2,
      ]);
    // projection.fitExtent(
    //   [
    //     [0, 0],
    //     [400, 400],
    //   ],
    //   {
    //     type: "FeatureCollection",
    //     features: features,
    //   }
    // );

    let xMinPix, xMaxPix, yMinPix, yMaxPix;
    // assign our pixel coordinates. Remember that y is flipped, up is down.
    [xMinPix, yMaxPix] = projection([bounds._sw.lng, bounds._sw.lat]);
    [xMaxPix, yMinPix] = projection([bounds._ne.lng, bounds._ne.lat]);

    console.log(xMinPix, xMaxPix, yMinPix, yMaxPix);
    // projection.postclip(
    //   d3.geoClipRectangle(xMinPix, yMinPix, xMaxPix, yMaxPix)
    // );
    projection.clipExtent([
      [xMinPix, yMinPix],
      [xMaxPix, yMaxPix],
    ]);

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
