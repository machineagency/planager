from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "SvgEditor.tool")) as json_file:
    CONFIG = json.load(json_file)


class SvgEditor(Tool, config=CONFIG):
    def state_updated(self, state):
        print(self.state)

    def inports_updated(self, inportID):
        # self.state["objectURL"] = self.inports["objectURL"]
        self.state["svgContents"] = self.inports["svgContents"]
