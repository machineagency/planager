from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Array2d.tool")) as json_file:
    CONFIG = json.load(json_file)


class Array2d(Action, config=CONFIG):
    def state_updated(self, key):
        if key == "paths":
            self.outports["paths"] = self.state["paths"]

    def inports_updated(self, inportID):
        port_handlers = {
            "svg": self.calculate_array,
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

    def set_start(self):
        if not self.inports["start"]:
            return
        self.state["start"] = self.inports["start"]
        self.calculate_array()

    def format_absolute_move_path(self, x, y):
        return f'<path d="M {x} {y}"></path>'

    def format_relative_move_path(self, x, y):
        return f'<path d="m 0 0 m {x} {y}"></path>'

    def calculate_array(self):
        if not self.inports["svg"]:
            return

        startx = self.state["start"][0]
        starty = self.state["start"][1]
        space = self.state["space"]
        arr = []

        for x in range(self.state["x_num"]):
            for y in range(self.state["y_num"]):
                arr.append(
                    self.format_absolute_move_path(
                        startx + x * space, starty + y * space
                    )
                )

                arr.append(self.inports["svg"])
                # arr.append(self.format_relative_move_path(-end_pos[0], space - end_pos[1]))
                # arr.append([["m", -end_pos[0], dist - end_pos[1]]])
        arr.append(self.format_absolute_move_path(startx, starty))

        self.outports["svgArray"] = arr

        # end_pos = self.bounds()

        # if not self.inports["stroke"]:
        #     self.state["paths"] = []
        #     return
        # commands = [[["m", 10, 10]]]
        # dist = self.state["space"]
        # x_repeat = self.state["x_num"]
        # y_repeat = self.state["y_num"]
        # for x in range(x_repeat):
        #     for _ in range(y_repeat):
        #         commands[0].extend(self.inports["stroke"][0])
        #         commands[0].extend([["m", -end_pos[0], dist - end_pos[1]]])
        #     commands[0].extend([["m", dist, -y_repeat * dist]])
        # self.state["paths"] = commands

    # def bounds(self):
    #     if not self.inports["svg"]:
    #         return
    #     mins = [0, 0]
    #     maxes = [0, 0]
    #     pos = [0, 0]
    #     for command in self.inports["svg"][0]:
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

    #     # print("BOUNDS:", mins, maxes)
    #     # print("rel", pos[0], pos[1])
    #     self.state["bounds"] = [mins, maxes]

    #     return pos
