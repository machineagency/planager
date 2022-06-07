from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Upload.tool")) as json_file:
    CONFIG = json.load(json_file)


class Upload(Action, config=CONFIG):
    def state_updated(self, state):
        print(self.state)
