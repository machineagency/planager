import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import { createRef, ref } from "lit/directives/ref.js";

import "mapbox-gl";
import { mapboxAccessToken } from "./secrets";

mapboxgl.accessToken = mapboxAccessToken;

export default class ContourMap extends Tool {
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

    this.map = new mapboxgl.Map({
      container: this.mapContainer.value,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.long, this.state.lat],
      zoom: this.state.zoom,
    });

    this.map.on("load", () => {
      this.map.addLayer({
        id: "terrain-data",
        type: "line",
        source: {
          type: "vector",
          url: "mapbox://mapbox.mapbox-terrain-v2",
        },
        "source-layer": "contour",
      });
    });

    this.map.on("move", () => {
      this.state.long = this.map.getCenter().lng.toFixed(4);
      this.state.lat = this.map.getCenter().lat.toFixed(4);
      this.state.zoom = this.map.getZoom().toFixed(2);
    });
  }

  render() {
    return this.renderModule(
      html`<link
          href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css"
          rel="stylesheet" />
        <div>
          <div id="map-container" ${ref(this.mapContainer)}></div>
        </div>`
    );
  }
}
