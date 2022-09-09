from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "SvgTransform.tool")) as json_file:
    CONFIG = json.load(json_file)


class SvgTransform(Action, config=CONFIG):
    def set_svg_string(self, str):
        self.outports["element"] = str
