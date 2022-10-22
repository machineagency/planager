{
  "displayName": "Map",
  "inports": {},
  "outports": {
    "geojson": {
      "displayName": "geojson"
    },
    "bounds": {
      "displayName": "bounds"
    }
  },
  "state": {
    "lat": 47.658,
    "long": -122.2925,
    "zoom": 10,
    "style": {
      "version": 8,
      "name": "Mapbox Style",
      "sources": {
        "mapbox-streets": {
          "type": "vector",
          "url": "mapbox://mapbox.mapbox-streets-v8"
        }
      },
      "layers": [
        {
          "id": "water-fill",
          "source": "mapbox-streets",
          "source-layer": "water",
          "type": "fill",
          "paint": {
            "fill-color": "#bbc6e7",
            "fill-outline-color": "#ffffff"
          }
        },
        {
          "id": "water-outline",
          "source": "mapbox-streets",
          "source-layer": "water",
          "type": "line",
          "paint": {
            "line-color": "#0983f6"
          }
        },
        {
          "id": "roads",
          "source": "mapbox-streets",
          "source-layer": "road",
          "type": "line",
          "paint": {
            "line-color": "#282a36"
          },
          "filter": [
            "match",
            [
              "get",
              "class"
            ],
            [
              "street",
              "primary",
              "tertiary",
              "secondary",
              "trunk",
              "major_rail",
              "ferry",
              "motorway",
              "minor_rail"
            ],
            true,
            false
          ]
        }
      ]
    }
  }
}
