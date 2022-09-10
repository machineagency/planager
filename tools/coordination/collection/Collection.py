from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Collection.tool")) as json_file:
    CONFIG = json.load(json_file)

# Rename this as record?
class Collection(Tool, config=CONFIG):
    def grab(self):
        key = self.inports["name"]
        value = self.inports["candidate"]
        if not (key or value):
            return
        temp = self.state["collection"]
        temp[key] = value
        self.state["collection"] = temp
        self.outports["collection"] = self.state["collection"]
