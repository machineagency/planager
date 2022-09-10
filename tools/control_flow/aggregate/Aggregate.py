from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Aggregate.tool")) as json_file:
    CONFIG = json.load(json_file)


class Aggregate(Tool, config=CONFIG):
    def state_updated(self, key):
        self.outports["aggregate"] = self.state["aggregate"]

    def inports_updated(self, inportID):
        port_handlers = {"append": self.append}
        port_handlers[inportID]()

    def append(self):
        val = self.inports["append"]
        if not val:
            return
        self.state["aggregate"].append(self.inports["append"])
        self.state.notify("aggregate")

    def clear(self, arg):
        self.state["aggregate"] = []
        self.outports["aggregate"] = []
