from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "PathData.tool")) as json_file:
    CONFIG = json.load(json_file)


class PathData(Action, config=CONFIG):
    def set_d_string(self, arg):
        self.outports["d"] = arg
