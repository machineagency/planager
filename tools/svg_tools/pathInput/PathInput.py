from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "PathInput.tool")) as json_file:
    CONFIG = json.load(json_file)


class PathInput(Tool, config=CONFIG):
    def state_updated(self, key):
        state_handlers = {"svg": self.svg}
        state_handlers[key]()

    def svg(self):
        self.outports["svg"] = self.state["svg"]
