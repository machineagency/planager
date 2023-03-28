from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "P5Editor.tool")) as json_file:
    CONFIG = json.load(json_file)


class P5Editor(Tool, config=CONFIG):
    def state_updated(self, sketch):
        self.outports["sketch"] = self.state["sketch"]
