import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import { createRef, ref } from "lit/directives/ref.js";

import mapboxGl from "mapbox-gl";
import { mapboxAccessToken } from "./secrets";

mapboxGl.accessToken = mapboxAccessToken;

const defaultStyle = {
  version: 8,
  name: "Mapbox Style",
  sources: {
    "mapbox-streets": {
      type: "vector",
      url: "mapbox://mapbox.mapbox-streets-v8",
    },
  },
  layers: [
    {
      id: "water-fill",
      source: "mapbox-streets",
      "source-layer": "water",
      type: "fill",
      paint: {
        "fill-color": "#bbc6e7",
        "fill-outline-color": "#ffffff",
      },
    },
    {
      id: "water-outline",
      source: "mapbox-streets",
      "source-layer": "water",
      type: "line",
      paint: {
        "line-color": "#0983f6",
      },
    },
    {
      id: "roads",
      source: "mapbox-streets",
      "source-layer": "road",
      type: "line",
      paint: {
        "line-color": "#282a36",
      },
      filter: [
        "match",
        ["get", "class"],
        [
          "street",
          "primary",
          "tertiary",
          "secondary",
          "trunk",
          "major_rail",
          "ferry",
          "motorway",
          "minor_rail",
        ],
        true,
        false,
      ],
    },
  ],
};

export default class GeoMap extends Tool {
  static styles = css`
    #map-container {
      height: 30rem;
      width: 30rem;
      resize: both;
    }
  `;

  mapContainer = createRef();
  map;

  firstUpdated() {
    if (this.map) return; // initialize map only once

    this.map = new mapboxGl.Map({
      container: this.mapContainer.value,
      style: defaultStyle,
      center: [this.state.long, this.state.lat],
      zoom: this.state.zoom,
      projection: "mercator",
    });

    this.map.on("move", () => {
      this.state.long = this.map.getCenter().lng.toFixed(4);
      this.state.lat = this.map.getCenter().lat.toFixed(4);
      this.state.zoom = this.map.getZoom().toFixed(2);
    });

    this.map.on("idle", (e) => {
      // When the map is idled (no more zooming, panning, or resizing) we query
      // the rendered features and send them to the outport

      // This is how you query only some layers
      // let features = this.map.queryRenderedFeatures({
      //   layers: ["roads", "water-outline"],
      // });

      let features = this.map.queryRenderedFeatures();

      this.api.runMethod("set_geojson", features);

      const bounds = this.map.getBounds();
      this.api.runMethod("set_bounds", bounds);

      let map = this.mapContainer.value;
      this.api.runMethod("set_view", {
        width: map.clientWidth,
        height: map.clientHeight,
      });
    });

    // If the map container changes size, call the mapbox map resize method
    const observer = new ResizeObserver(() => {
      this.map.resize();
    });
    observer.observe(this.mapContainer.value);
  }

  render() {
    if (this.inports.config) {
      try {
        this.map.setStyle(this.inports.config);
      } catch {
        console.log("Invalid map style");
      }
    }
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
