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
            self.update_state("connected", False)
            return
        self.update_state("connected", self.ad.connected)
        self.update_state("position", self.ad.current_pos())
        self.update_state("pen", self.ad.current_pen())
        self.update_outport("config", self.ad.options.__dict__)

    def inports_updated(self, inportID):
        port_handlers = {"live": self.liveMove}
        port_handlers[inportID]()

    def home(self):
        self.ad.moveto(0, 0)

    def liveMove(self):
        """Runs when the live move port is updated"""
        command_set = self.inports["live"].value
        start = [2, 2]
        if not command_set:
            return
        for command in command_set:
            if command[0] == "m":
                print(f"Absolute move: {command[1]/100} x {command[2]/100} y")
                self.ad.moveto(start[0] + command[1] / 100, start[1] + command[2] / 100)
            if command[0] == "l":
                print(f"Relative move: {command[1]/100} x {command[2]/100} y")
                self.ad.line(command[1] / 100, command[2] / 100)
            pos = self.ad.current_pos()
            self.update_state("position", [pos[0], pos[1]])
            print(self.ad.current_pos())
        self.home()

    def do_move(self):
        print("move!")
        if not self.state["move_buffer"]:
            return
        move = self.state["move_buffer"][0]
        self.ad.line_to(move[0], move[1])
