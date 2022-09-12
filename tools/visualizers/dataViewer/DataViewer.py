from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "DataViewer.tool")) as json_file:
    CONFIG = json.load(json_file)


class DataViewer(Tool, config=CONFIG):
    pass
