from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "BooleanToggle.tool")) as json_file:
    CONFIG = json.load(json_file)


class BooleanToggle(Tool, config=CONFIG):
    def state_updated(self, key):
        self.outports["bool"] = self.state["bool"]

    def setup(self):
        self.outports["bool"] = self.state["bool"]
