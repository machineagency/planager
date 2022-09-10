from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "SvgTransform.tool")) as json_file:
    CONFIG = json.load(json_file)


class SvgTransform(Tool, config=CONFIG):
    def set_svg_string(self, str):
        self.outports["element"] = str
