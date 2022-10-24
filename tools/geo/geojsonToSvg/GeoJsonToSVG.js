import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

import { geoMercator, geoPath } from "d3-geo";
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
    const [features, bounds, view] = [
      this.inports.geojson,
      this.inports.bounds,
      this.inports.view,
    ];

    if (!features || !bounds || !view) return;

    const [width, height] = [view.width, view.height];

    // Initialize projection with a neutral value
    let projection = geoMercator().scale(1).translate([0, 0]);

    // Get pixel coordinates of the viewport bounds. Remember that y is flipped, up is down.
    const [xMinPix, yMaxPix] = projection([bounds._sw.lng, bounds._sw.lat]);
    const [xMaxPix, yMinPix] = projection([bounds._ne.lng, bounds._ne.lat]);

    // Calculate scale
    const scale =
      1 / Math.max((xMaxPix - xMinPix) / width, (yMaxPix - yMinPix) / height);

    // Calculate translation, center of bounding box coordinates
    const translate = [
      (width - scale * (xMaxPix + xMinPix)) / 2,
      (height - scale * (yMaxPix + yMinPix)) / 2,
    ];

    // Update projection with scale and translation
    projection
      .scale(scale)
      .translate(translate)
      // Clip any geometry that extends outside of viewport
      .clipExtent([
        [0, 0],
        [width, height],
      ]);

    // The geo path generator will convert geojson features to path data according to the projection we have set up
    let geoGenerator = geoPath().projection(projection);

    // Select map container, remove existing map, and add new map with appropriate size
    let mapContainer = select(this.shadowRoot.querySelector("#map-container"));
    mapContainer.selectAll("svg").remove();
    mapContainer
      .append("svg")
      .attr("width", view.width)
      .attr("height", view.height);

    // Select map SVG, append paths with pathdata calculated using the geoPath generator
    let map = select(this.shadowRoot.querySelector("svg"));
    map
      .attr("id", "map")
      .append("g")
      .selectAll("path")
      .data(features)
      .enter()
      .append("path")
      .attr("d", geoGenerator);

    let paths = map.selectAll("path").nodes();
    let pathList = [];
    for (const path of paths) {
      pathList.push(path.outerHTML);
    }
    this.api.runMethod("set_svg", pathList);
    // console.log(pathList);
    // console.log(paths[0].outerHTML);
  }

  render() {
    this.updateMap();
    return this.renderModule(html`<div id="map-container"></div>`);
  }
}
