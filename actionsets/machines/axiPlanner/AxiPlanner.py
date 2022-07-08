from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "AxiPlanner.tool")) as json_file:
    CONFIG = json.load(json_file)


class AxiPlanner(Action, config=CONFIG):
    def state_updated(self, key):
        if key == "paths":
            self.outports["paths"] = self.state["paths"]

    def inports_updated(self, inportID):
        # self.bounds()
        if not self.inports["stroke"]:
            return
        commands = []
        for x in range(7):
            for y in range(7):
                commands.append([["m", x * 20, y * 20]] + self.inports["stroke"])
        self.state["paths"] = commands

    # def bounds(self):
    #     if not self.inports["stroke"]:
    #         return
    #     mins = [0, 0]
    #     maxes = [0, 0]
    #     pos = [0, 0]
    #     for command in self.inports["stroke"]:
    #         pos[0] += command[1]
    #         pos[1] += command[2]
    #         if pos[0] < mins[0]:
    #             mins[0] = pos[0]
    #         if pos[1] < mins[1]:
    #             mins[1] = pos[1]
    #         if pos[0] > maxes[0]:
    #             maxes[0] = pos[0]
    #         if pos[1] > maxes[1]:
    #             maxes[1] = pos[1]

    #     print("BOUNDS:", mins, maxes)
    #     self.state["bounds"] = [mins, maxes]
