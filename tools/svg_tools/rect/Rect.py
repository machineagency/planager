from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Rect.tool")) as json_file:
    CONFIG = json.load(json_file)


class Rect(Action, config=CONFIG):
    def inports_updated(self, inportID):
        if self.inports["width"]:
            self.state["width"] = self.inports["width"]
        if self.inports["height"]:
            self.state["height"] = self.inports["height"]
        if self.inports["color"]:
            self.state["color"] = self.inports["color"]
        if self.inports["translate"]:
            self.state["translate"] = self.inports["translate"]

    def set_svg_string(self, str):
        self.outports["rect"] = str
