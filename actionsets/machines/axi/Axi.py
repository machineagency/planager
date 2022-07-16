from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Axi.tool")) as json_file:
    CONFIG = json.load(json_file)

from pyaxidraw import axidraw


class Axi(Action, config=CONFIG):
    def setup(self):
        self.ad = axidraw.AxiDraw()
        self.ad.interactive()
        self.ad.connect()
        if not self.ad.connected:
            self.state["connected"] = False
            return

        self.state["connected"] = self.ad.connected
        self.update_position()
        self.state["pen"] = self.ad.current_pen()
        self.ad.options.model = 2
        self.ad.options.units = 2
        self.ad.update()

    def update_position(self):
        pos = self.ad.current_pos()
        pen = self.ad.current_pen()
        print(pos)
        self.state["position"] = {"x": pos[0], "y": pos[1]}
        self.state["pen"] = pen
        self.outports["currentLocation"] = {
            "x": self.state["position"]["x"],  # / self.state["scale_factor"],
            "y": self.state["position"]["y"],  # / self.state["scale_factor"],
        }
        self.outports["pen"] = self.state["pen"]

    def inports_updated(self, inportID):
        port_handlers = {
            "move": self.liveMove,
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

    def liveMove(self):
        """Runs when the live move port is updated"""
        command_set = self.inports["move"]
        if not command_set:
            return

        for command in command_set:
            print(command)
            if command[0] == "m":
                # print(f"Absolute move: {command[1]/100} x {command[2]/100} y")
                self.move(command[1], command[2])
            elif command[0] == "l":
                # print(f"Relative move: {command[1]/100} x {command[2]/100} y")
                self.line(command[1], command[2])

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
