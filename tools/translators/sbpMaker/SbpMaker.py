from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "SbpMaker.tool")) as json_file:
    CONFIG = json.load(json_file)


class SbpMaker(Tool, config=CONFIG):
    PREFIX = "MS,3.667,1.833,,,\nTR,6112\nC6\n"
    SUFFIX = "\nC7\n"
    DIR_X = "X"
    DIR_Y = "Y"
    DIR_Z = "Z"

    def m(self, dir, amt):
        return f"M{dir},{amt}"

    def m2(self, x, y):
        return f"M2,{x},{y}"

    def m3(self, x, y, z):
        return f"M3,{x},{y},{z}"

    def j(self, dir, amt):
        return f"J{dir},{amt}"

    def j2(self, x, y):
        return f"J2,{x},{y}"

    def add_pre_post(self, commands):
        return self.PREFIX + "\n".join(commands) + self.SUFFIX

    def build_sbp(self):
        pixels_2d = self.inports["binary"]
        sbp_commands = []
        start = self.state["start"]
        step = self.state["step"]

        sbp_commands.append(self.j(self.DIR_Z, start[2]))

        curr_y = start[1]
        for row in pixels_2d:
            curr_x = start[0]
            for pixel in row:
                sbp_commands.append(self.j2(curr_x, curr_y))
                if pixel:
                    sbp_commands.append(self.m(self.DIR_Z, self.state["onDepth"]))
                    sbp_commands.append(self.m(self.DIR_Z, self.state["zPass"]))
                else:
                    sbp_commands.append(self.m(self.DIR_Z, self.state["offDepth"]))
                    sbp_commands.append(self.m(self.DIR_Z, self.state["zPass"]))
                curr_x += step
            curr_y += step
        return self.add_pre_post(sbp_commands)

    def build_from_paths(self):
        sbp_commands = []

        path_data = self.inports["path"]
        if not path_data:
            return

        start = self.state["start"]
        sbp_commands.append(self.j(self.DIR_Z, start[2]))

        path = path_data.split(" ")

        for i in range(0, len(path), 3):
            if path[i] == "m":
                sbp_commands.append(self.m2(float(path[i + 1]), float(path[i + 2])))
            elif path[i] == "M":
                sbp_commands.append(self.m2(float(path[i + 1]), float(path[i + 2])))
            elif path[i] == "l":
                sbp_commands.append(self.m2(float(path[i + 1]), float(path[i + 2])))
            elif path[i] == "L":
                sbp_commands.append(self.m2(float(path[i + 1]), float(path[i + 2])))

        return self.add_pre_post(sbp_commands)

    def send_sbp(self, command):
        self.outports["command"] = command

    def inports_updated(self, inport_id):
        if inport_id == "binary":
            self.outports["file"] = self.build_sbp()
        if inport_id == "path":
            self.outports["file"] = self.build_from_paths()
