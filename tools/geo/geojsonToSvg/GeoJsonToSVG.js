import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import { geoEquirectangular, geoPath, geoClipRectangle } from "d3-geo";
import { select } from "d3";

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
    // Ensure features and bounds are defined
    const features = this.inports.geojson;
    const bounds = this.inports.bounds;
    if (!features || !bounds) return;

    const lngCenter = (bounds._sw.lng - bounds._ne.lng) / 2 + bounds._ne.lng;
    const latCenter = (bounds._sw.lat - bounds._ne.lat) / 2 + bounds._ne.lat;

    console.log("bounds:", bounds);
    console.log("lat:", latCenter, "lng:", lngCenter);

    let projection = geoEquirectangular()
      .center([lngCenter, latCenter])
      .translate([200, 200]);

    // assign our pixel coordinates. Remember that y is flipped, up is down.
    let xMinPix, xMaxPix, yMinPix, yMaxPix;
    [xMinPix, yMaxPix] = projection([bounds._sw.lng, bounds._sw.lat]);
    [xMaxPix, yMinPix] = projection([bounds._ne.lng, bounds._ne.lat]);

    console.log("Pixels:", xMinPix, xMaxPix, yMinPix, yMaxPix);
    projection.postclip(geoClipRectangle(xMinPix, yMinPix, xMaxPix, yMaxPix));

    // projection.clipExtent([
    //   [xMinPix, yMinPix],
    //   [xMaxPix, yMaxPix],
    // ]);
    projection.fitExtent;

    let geoGenerator = geoPath().projection(projection);

    let map = select(this.shadowRoot.querySelector("#map"));

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
