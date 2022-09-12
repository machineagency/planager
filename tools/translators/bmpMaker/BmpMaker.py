from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "BmpMaker.tool")) as json_file:
    CONFIG = json.load(json_file)


class BmpMaker(Tool, config=CONFIG):
    def setup(self):
        self.outports["mime"] = "image/bmp"
