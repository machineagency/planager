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
        port_handlers = {
            "stroke": self.calculate_array,
            "x_num": self.set_x,
            "y_num": self.set_y,
            "space": self.set_spacing,
        }
        port_handlers[inportID]()

    def set_x(self):
        if not self.inports["x_num"]:
            return
        self.state["x_num"] = int(self.inports["x_num"])
        self.calculate_array()

    def set_y(self):
        if not self.inports["y_num"]:
            return
        self.state["y_num"] = int(self.inports["y_num"])
        self.calculate_array()

    def set_spacing(self):
        if not self.inports["space"]:
            return
        self.state["space"] = int(self.inports["space"])
        self.calculate_array()

    def calculate_array(self):
        end_pos = self.bounds()

        if not self.inports["stroke"]:
            self.state["paths"] = []
            return
        commands = [[["m", 10, 10]]]
        dist = self.state["space"]
        x_repeat = self.state["x_num"]
        y_repeat = self.state["y_num"]
        for x in range(x_repeat):
            for _ in range(y_repeat):
                commands[0].extend(self.inports["stroke"][0])
                commands[0].extend([["m", -end_pos[0], dist - end_pos[1]]])
            commands[0].extend([["m", dist, -y_repeat * dist]])
        self.state["paths"] = commands

    def bounds(self):
        if not self.inports["stroke"]:
            return
        mins = [0, 0]
        maxes = [0, 0]
        pos = [0, 0]
        for command in self.inports["stroke"][0]:
            pos[0] += command[1]
            pos[1] += command[2]
            if pos[0] < mins[0]:
                mins[0] = pos[0]
            if pos[1] < mins[1]:
                mins[1] = pos[1]
            if pos[0] > maxes[0]:
                maxes[0] = pos[0]
            if pos[1] > maxes[1]:
                maxes[1] = pos[1]

        # print("BOUNDS:", mins, maxes)
        # print("rel", pos[0], pos[1])
        self.state["bounds"] = [mins, maxes]

        return pos
