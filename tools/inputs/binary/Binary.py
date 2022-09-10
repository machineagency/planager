from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Binary.tool")) as json_file:
    CONFIG = json.load(json_file)


class Binary(Action, config=CONFIG):
    def state_updated(self, key):
        self.outports["val"] = self.state["val"]

    def setup(self):
        self.outports["val"] = self.state["val"]
