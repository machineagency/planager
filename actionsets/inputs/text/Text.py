from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Text.tool")) as json_file:
    CONFIG = json.load(json_file)


class Text(Action, config=CONFIG):
    def state_updated(self):
        self.update_outport("text", self.state["text"])
