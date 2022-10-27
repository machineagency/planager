from planager.Tool import Tool
import requests

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "GeoMap.tool")) as json_file:
    CONFIG = json.load(json_file)


class GeoMap(Tool, config=CONFIG):
    def set_geojson(self, geojson):
        self.outports["geojson"] = geojson

    def set_bounds(self, bounds):
        self.outports["bounds"] = bounds

    def set_view(self, view):
        self.outports["view"] = view

    def inports_updated(self, inportID):
        self.state["style"] = self.inports["config"]
