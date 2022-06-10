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
        self.outports["config"] = self.ad.options.__dict__

    def update_position(self):
        pos = self.ad.current_pos()
        self.state["position"] = {"x": pos[0], "y": pos[1]}
        self.outports["currentLocation"] = self.state["position"]

    def inports_updated(self, inportID):
        port_handlers = {
            "live": self.liveMove,
            "config": self.updateConfig,
            "location": self.goto,
            "svg": self.draw_svg,
        }
        port_handlers[inportID]()

    def goto(self):
        loc = self.inports["location"]
        if not loc:
            return
        self.ad.moveto(float(loc["x"]), float(loc["y"]))
        self.update_position()

    def updateConfig(self):
        print(self.inports["config"])

    def home(self):
        self.ad.moveto(0, 0)

    def draw_svg(self):
        self.ad.plot_setup(self.inports["svg"])
        self.ad.options.digest = 2
        output = self.ad.plot_run(True)
        print(output)

    def liveMove(self):
        """Runs when the live move port is updated"""
        command_set = self.inports["live"]
        if not command_set:
            return
        self.state["move_buffer"] = self.state["move_buffer"] + command_set

    def move_from_buffer(self):
        buffer = self.state["move_buffer"]
        if not buffer:
            return

        command = buffer[0]

        if command[0] == "m":
            # print(f"Absolute move: {command[1]/100} x {command[2]/100} y")
            self.ad.moveto(command[1] / 100, command[2] / 100)
        if command[0] == "l":
            # print(f"Relative move: {command[1]/100} x {command[2]/100} y")
            self.ad.line(command[1] / 100, command[2] / 100)

        self.update_position()
        self.state["move_buffer"] = buffer[1:]

    def do_move(self, arg):
        if not self.state["move_buffer"]:
            return

        while self.state["move_buffer"]:
            self.move_from_buffer()

        self.home()
