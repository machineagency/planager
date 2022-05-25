from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "JsonViewer.tool")) as json_file:
    CONFIG = json.load(json_file)


class JsonViewer(Action, config=CONFIG):
    def inports_updated(self):
        self.update_state("jsonData", self.inports["jsonData"].value)

    def state_updated(self):
        self.update_outport("jsonData", self.state["jsonData"])
