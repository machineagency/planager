from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Circle.tool")) as json_file:
    CONFIG = json.load(json_file)


class Circle(Action, config=CONFIG):
    def inports_updated(self, inportID):
        self.state["diameter"] = self.inports["diameter"]