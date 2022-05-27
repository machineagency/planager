from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "JsonViewer.tool")) as json_file:
    CONFIG = json.load(json_file)


class JsonViewer(Action, config=CONFIG):
    def inports_updated(self, inportID):
        self.state["jsonData"] = self.inports["jsonData"]

    def state_updated(self, key):
        self.outports["jsonData"] = self.state["jsonData"]
