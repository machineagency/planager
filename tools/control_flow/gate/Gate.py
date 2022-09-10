from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Gate.tool")) as json_file:
    CONFIG = json.load(json_file)


class Gate(Tool, config=CONFIG):
    def set_gate(self, state):
        self.state["open"] = state
        self.should_outport_update()

    def should_outport_update(self):
        if self.state["open"]:
            self.outports["out"] = self.inports["in"]
        else:
            self.outports["out"] = None

    def state_updated(self, key):
        self.should_outport_update()

    def inports_updated(self, inportID):
        if inportID == "in":
            self.should_outport_update()
