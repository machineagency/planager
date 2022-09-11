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
    def inports_updated(self, inport_id):
        if inport_id == "rule":
            self.state["rule"] = self.inports["rule"]
        if inport_id == "border":
            self.state["border"] = self.inports["border"]
        if inport_id == "iterations":
            self.state["iterations"] = self.inports["iterations"]
        if inport_id == "startState":
            self.state["startState"] = self.inports["startState"]

    def set_automata(self, automata):
        self.outports["automata"] = automata
