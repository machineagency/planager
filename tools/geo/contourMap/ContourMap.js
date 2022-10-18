import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";
import { createRef, ref } from "lit/directives/ref.js";

import "mapbox-gl";
import { mapboxAccessToken } from "./secrets";

mapboxgl.accessToken = mapboxAccessToken;

const streets = {
  version: 8,
  name: "Mapbox Traffic tileset v1",
  sources: {
    "mapbox-traffic": {
      url: "mapbox://mapbox.mapbox-traffic-v1",
      type: "vector",
    },
    // "mapbox-terrain": {
    //   type: "vector",
    //   url: "mapbox://mapbox.mapbox-terrain-v2",
    // },
    "mapbox-streets": {
      type: "vector",
      url: "mapbox://mapbox.mapbox-streets-v8",
    },
  },
  layers: [
    {
      id: "water",
      source: "mapbox-streets",
      "source-layer": "water",
      type: "fill",
      paint: {
        "fill-color": "rgba(66,100,251, 0.3)",
        "fill-outline-color": "rgba(66,100,251, 1)",
      },
    },
    {
      id: "roads",
      source: "mapbox-streets",
      "source-layer": "road",
      type: "line",
      paint: {
        "line-color": "#222222",
      },
    },
    // {
    //   id: "traffic",
    //   source: "mapbox-traffic",
    //   "source-layer": "traffic",
    //   type: "line",
    //   paint: {
    //     "line-width": 1.5,
    //     "line-color": [
    //       "case",
    //       ["==", "low", ["get", "congestion"]],
    //       "#aab7ef",
    //       ["==", "moderate", ["get", "congestion"]],
    //       "#4264fb",
    //       ["==", "heavy", ["get", "congestion"]],
    //       "#ee4e8b",
    //       ["==", "severe", ["get", "congestion"]],
    //       "#b43b71",
    //       "#000000",
    //     ],
    //   },
    // },
  ],
};

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
      style: streets,
      center: [this.state.long, this.state.lat],
      zoom: this.state.zoom,
    });

    this.map.on("move", () => {
      this.state.long = this.map.getCenter().lng.toFixed(4);
      this.state.lat = this.map.getCenter().lat.toFixed(4);
      this.state.zoom = this.map.getZoom().toFixed(2);
      // console.log(this.map);
    });

    this.map.on("click", (e) => {
      console.log(this.map);
      let features = this.map.queryRenderedFeatures({ layers: ["roads"] });
      console.log(features.length);
      features.slice(1, 5).forEach((el) => {
        console.log(el);
        console.log(el.geometry);
      });
    });
  }

  render() {
    return this.renderModule(
      html`<link
          href="https://api.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css"
          rel="stylesheet" />
        <div>
          <div
            id="map-container"
            ${ref(this.mapContainer)}></div>
        </div>`
    );
  }
}
