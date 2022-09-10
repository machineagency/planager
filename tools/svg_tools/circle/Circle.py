from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Circle.tool")) as json_file:
    CONFIG = json.load(json_file)


class Circle(Tool, config=CONFIG):
    def set_svg_string(self, str):
        self.outports["svg"] = str
