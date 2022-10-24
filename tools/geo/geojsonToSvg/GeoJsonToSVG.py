from planager.Tool import Tool
import requests

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "GeoJsonToSVG.tool")) as json_file:
    CONFIG = json.load(json_file)


class GeoJsonToSVG(Tool, config=CONFIG):
    def set_svg(self, paths):
        self.outports["paths"] = paths
