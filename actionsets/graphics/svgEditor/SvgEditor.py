from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "SvgEditor.tool")) as json_file:
    CONFIG = json.load(json_file)


class SvgEditor(Action, config=CONFIG):
    def state_updated(self):
        print(self.state)
        # self.update_outport("place", self.state["locs"][-1])
        # self.update_outport("paths", self.state["paths"])
