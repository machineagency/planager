from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Slider.tool")) as json_file:
    CONFIG = json.load(json_file)


class Slider(Tool, config=CONFIG):
    def state_updated(self, key):
        self.outports["value"] = self.state["value"]

    def setup(self):
        self.outports["value"] = self.state["value"]
