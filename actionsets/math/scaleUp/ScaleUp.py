from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "ScaleUp.tool")) as json_file:
    CONFIG = json.load(json_file)


class ScaleUp(Action, config=CONFIG):
    def inports_updated(self, inportID):
        if self.inports["position"]:
            self.multiply_coords()
        if self.inports["array"]:
            self.multiply_array()
        if self.inports["multiplier"]:
            self.state["multiplier"] = self.inports["multiplier"]

    def multiply_coords(self):
        val = {}
        val["x"] = self.state["multiplier"] * float(self.inports["position"]["x"])
        val["y"] = self.state["multiplier"] * float(self.inports["position"]["y"])
        self.outports["value"] = val

    def multiply_array(self):
        arr = []
        x = self.state["multiplier"]
        for val in self.inports["array"]:
            print(val)
            arr.append([val[0], val[1] * x, val[2] * x])

        self.outports["value"] = arr
