from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Array2d.tool")) as json_file:
    CONFIG = json.load(json_file)


class Array2d(Tool, config=CONFIG):
    def state_updated(self, key):
        if key == "paths":
            self.outports["paths"] = self.state["paths"]

    def inports_updated(self, inportID):
        port_handlers = {
            "svg": self.calculate_array,
            "xNum": self.set_x,
            "yNum": self.set_y,
            "space": self.set_spacing,
            "start": self.set_start,
        }
        port_handlers[inportID]()

    def set_x(self):
        if not self.inports["xNum"]:
            return
        self.state["xNum"] = int(self.inports["xNum"])
        self.calculate_array()

    def set_y(self):
        if not self.inports["yNum"]:
            return
        self.state["yNum"] = int(self.inports["yNum"])
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

    def format_absolute_move_path(self, startx, starty, rest):
        return f'<path d="M {startx} {starty} {rest}" stroke-width="1" stroke="var(--planager-pink)" fill="none"></path>'

    def format_relative_move_path(self, x, y):
        return f'<path d="m 0 0 m {x} {y}"></path>'

    def calculate_array(self):
        if not self.inports["svg"]:
            return

        startx = self.state["start"][0]
        starty = self.state["start"][1]
        space = self.state["space"]
        arr = []

        for x in range(self.state["xNum"]):
            for y in range(self.state["yNum"]):
                arr.append(
                    self.format_absolute_move_path(
                        startx + x * space, starty + y * space, self.inports["svg"]
                    )
                )

        arr.append(self.format_absolute_move_path(startx, starty, ""))

        self.outports["svgArray"] = arr
