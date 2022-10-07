from planager.Tool import Tool
import requests

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "ContourMap.tool")) as json_file:
    CONFIG = json.load(json_file)


class ContourMap(Tool, config=CONFIG):
    pass
