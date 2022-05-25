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
        print(self.ad.params)

    def inports_updated(self):
        print("woo")

    def connect(self):
        self.ad = axidraw.AxiDraw()
        self.ad.interactive()
        self.ad.connect()
        print(self.ad.params)
