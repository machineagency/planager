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
        self.state["position"] = self.ad.current_pos()
        self.state["pen"] = self.ad.current_pen()
        self.outports["config"] = self.ad.options.__dict__

    def inports_updated(self, inportID):
        port_handlers = {"live": self.liveMove, "config": self.updateConfig}
        port_handlers[inportID]()

    def updateConfig(self):
        print(self.inports["config"])

    def home(self):
        self.ad.moveto(0, 0)

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
        start = self.state["offset"]

        if command[0] == "m":
            # print(f"Absolute move: {command[1]/100} x {command[2]/100} y")
            self.ad.moveto(start[0] + command[1] / 100, start[1] + command[2] / 100)
        if command[0] == "l":
            # print(f"Relative move: {command[1]/100} x {command[2]/100} y")
            self.ad.line(command[1] / 100, command[2] / 100)

        pos = self.ad.current_pos()

        self.state["position"] = [pos[0], pos[1]]
        self.state["move_buffer"] = buffer[1:]

    def do_move(self):
        if not self.state["move_buffer"]:
            return

        while self.state["move_buffer"]:
            self.move_from_buffer()

        self.home()
