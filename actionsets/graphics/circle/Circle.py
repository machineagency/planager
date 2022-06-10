from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Circle.tool")) as json_file:
    CONFIG = json.load(json_file)


class Circle(Action, config=CONFIG):
    def inports_updated(self, inportID):
        if self.inports["diameter"]:
            self.state["diameter"] = self.inports["diameter"]
        if self.inports["color"]:
            self.state["color"] = self.inports["color"]
        if self.inports["translate"]:
            self.state["translate"] = self.inports["translate"]

    def set_svg_string(self, str):
        self.outports["circle"] = str
