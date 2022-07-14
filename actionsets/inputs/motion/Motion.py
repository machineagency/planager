from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Motion.tool")) as json_file:
    CONFIG = json.load(json_file)


class Motion(Action, config=CONFIG):
    def state_updated(self, key):
        state_handlers = {"paths": self.paths, "svg": self.svg}
        state_handlers[key]()

    def paths(self):
        self.outports["live"] = self.state["paths"]

    def svg(self):
        self.outports["svg"] = self.state["svg"]
