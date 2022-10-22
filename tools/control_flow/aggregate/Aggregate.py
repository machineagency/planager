from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Aggregate.tool")) as json_file:
    CONFIG = json.load(json_file)


class Aggregate(Tool, config=CONFIG):
    def state_updated(self, key):
        self.outports["arr"] = self.state["arr"]

    def inports_updated(self, inportID):
        port_handlers = {"add": self.append}
        port_handlers[inportID]()

    def append(self):
        val = self.inports["add"]
        if not val:
            return
        self.state["arr"].append(self.inports["add"])
        self.state.notify("arr")

    def clear(self, arg):
        self.state["arr"] = []
        self.outports["arr"] = []
