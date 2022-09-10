from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Upload.tool")) as json_file:
    CONFIG = json.load(json_file)


class Upload(Tool, config=CONFIG):
    def state_updated(self, state):
        self.outports["fileURL"] = self.state["fileURL"]
        self.outports["fileType"] = self.state["fileType"]
        self.outports["fileSize"] = self.state["fileSize"]
        self.outports["fileContents"] = self.state["fileContents"]
