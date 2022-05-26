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
        self.update_state("connected", self.ad.connected)
        self.update_state("position", self.ad.current_pos())
        self.update_state("pen", self.ad.current_pen())
        self.update_outport("config", self.ad.options.__dict__)

    def inports_updated(self):
        print("woo")

    def do_move(self):
        print("move!")
        if not self.state["move_buffer"]:
            return
        move = self.state["move_buffer"][0]
        self.ad.line_to(move[0], move[1])
