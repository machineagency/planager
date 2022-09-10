from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(
    os.path.join(os.path.dirname(__file__), "CellularAutomata.tool")
) as json_file:
    CONFIG = json.load(json_file)


class CellularAutomata(Tool, config=CONFIG):
    def inports_updated(self, inportID):
        print("helloooooooooo")
        if self.inports["rule"]:
            self.state["rule"] = self.inports["rule"]
        if self.inports["border"] is not None:
            self.state["border"] = self.inports["border"]
        if self.inports["iterations"]:
            self.state["iterations"] = self.inports["iterations"]
        if self.inports["startState"]:
            self.state["startState"] = self.inports["startState"]

    def state_updated(self, key):
        self.outports["automata"] = self.state["automata"]
