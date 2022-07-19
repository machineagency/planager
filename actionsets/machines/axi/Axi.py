from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Axi.tool")) as json_file:
    CONFIG = json.load(json_file)

from pyaxidraw import axidraw


# MODELS: Axidraw SE: 2, travel 430, 297
#        Axidraw minikit: 4, travel 160, 101.6


class Axi(Action, config=CONFIG):
    def setup(self):
        self.ad = axidraw.AxiDraw()
        self.ad.interactive()
        self.ad.connect()
        if not self.ad.connected:
            self.state["connected"] = False
            return

        self.state["connected"] = self.ad.connected
        self.outports["dimensions"] = [430, 297]  # change for different models
        self.update_position()
        self.state["pen"] = self.ad.current_pen()
        self.ad.options.model = 2  # change for different models
        self.ad.options.units = 2
        self.ad.update()

    def update_position(self):
        pos = self.ad.current_pos()
        pen = self.ad.current_pen()
        # print(pos)
        self.state["position"] = {"x": pos[0], "y": pos[1]}
        self.state["pen"] = pen

        self.outports["currentLocation"] = [
            self.state["position"]["x"],
            self.state["position"]["y"],
        ]
        self.outports["pen"] = self.state["pen"]

    def inports_updated(self, inportID):
        port_handlers = {
            "pathData": self.move_from_path_data,
            "location": self.goto,
            "pen": self.set_pen,
        }
        port_handlers[inportID]()

    def goto(self):
        loc = self.inports["location"]
        if not loc:
            return
        self.moveto(float(loc["x"]), float(loc["y"]))

    def moveto(self, x, y):
        self.ad.moveto(x, y)
        self.update_position()

    def move(self, x, y):
        self.ad.move(x, y)
        self.update_position()

    def lineto(self, x, y):
        self.ad.lineto(x, y)
        self.update_position()

    def line(self, x, y):
        self.ad.line(x, y)
        self.update_position()

    def home(self):
        self.move(0, 0)

    def move_from_path_data(self):
        """Runs when the live move port is updated"""
        d = self.inports["pathData"]
        if not d:
            return
        path = self.inports["pathData"].split(" ")

        for i in range(0, len(path), 3):
            if path[i] == "m":
                self.move(float(path[i + 1]), float(path[i + 2]))
            elif path[i] == "M":
                self.moveto(float(path[i + 1]), float(path[i + 2]))
            elif path[i] == "l":
                self.line(float(path[i + 1]), float(path[i + 2]))
            elif path[i] == "L":
                self.lineto(float(path[i + 1]), float(path[i + 2]))

        self.update_position()

    def set_pen(self):
        if self.inports["pen"]:
            self.ad.penup()
        elif not self.inports["pen"]:
            self.ad.pendown()
        self.update_position()

    def align(self, arg):
        self.ad.plot_setup()
        self.ad.options.mode = "align"
        self.ad.plot_run()

    def motor_status(self, arg):
        print("Turning off axidraw motors")
        self.ad.plot_setup()
        self.ad.options.mode = "manual"
        self.ad.options.manual_cmd = "disable_xy"
        self.ad.plot_run()

    def set_home(self, arg):
        self.ad.plot_setup()
        self.ad.options.mode = "manual"
        self.ad.options.manual_cmd = "enable_xy"
        self.ad.plot_run()
        self.ad.interactive()
        self.ad.connect()
        self.ad.options.model = 2
        self.ad.options.units = 2
        self.ad.update()
        self.update_position()
