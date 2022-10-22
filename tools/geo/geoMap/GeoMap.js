import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import { createRef, ref } from "lit/directives/ref.js";

import mapboxGl from "mapbox-gl";
import { mapboxAccessToken } from "./secrets";

mapboxGl.accessToken = mapboxAccessToken;

export default class GeoMap extends Tool {
  static styles = css`
    #map-container {
      height: 30rem;
      width: 30rem;
    }
  `;

  mapContainer = createRef();
  map;

  firstUpdated() {
    if (this.map) return; // initialize map only once

    this.map = new mapboxGl.Map({
      container: this.mapContainer.value,
      style: this.state.style,
      center: [this.state.long, this.state.lat],
      zoom: this.state.zoom,
      projection: "equirectangular",
    });

    this.map.on("move", () => {
      this.state.long = this.map.getCenter().lng.toFixed(4);
      this.state.lat = this.map.getCenter().lat.toFixed(4);
      this.state.zoom = this.map.getZoom().toFixed(2);
    });

    this.map.on("idle", (e) => {
      // When the map is idled (no more zooming or panning) we query the
      // rendered features and send them to the outport
      let features = this.map.queryRenderedFeatures({
        layers: ["roads", "water-outline"],
      });
      this.api.runMethod("set_geojson", features);

      const bounds = this.map.getBounds();
      this.api.runMethod("set_bounds", bounds);
    });
  }

  render() {
    return this.renderModule(
      html` <link
          href="https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css"
          rel="stylesheet" />
        <div>
          <div
            id="map-container"
            ${ref(this.mapContainer)}></div>
        </div>`
    );
  }
}
