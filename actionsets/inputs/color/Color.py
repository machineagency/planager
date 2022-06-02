from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Color.tool")) as json_file:
    CONFIG = json.load(json_file)


class Color(Action, config=CONFIG):
    def state_updated(self, key):
        self.outports["color"] = self.state["color"]

    def setup(self):
        self.outports["color"] = self.state["color"]
