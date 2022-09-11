from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Text.tool")) as json_file:
    CONFIG = json.load(json_file)


class Text(Tool, config=CONFIG):
    def state_updated(self, key):
        self.outports["text"] = self.state["text"]

    def setup(self):
        self.outports["text"] = self.state["text"]
