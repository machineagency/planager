from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Canvas.tool")) as json_file:
    CONFIG = json.load(json_file)


class Canvas(Action, config=CONFIG):
    def state_updated(self, key):
        print(self.state)
