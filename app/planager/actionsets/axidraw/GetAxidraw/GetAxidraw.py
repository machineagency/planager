from pyaxidraw import axidraw   # Import the module
from ....workflow.Action import Action

from pyaxidraw import axidraw

CONFIG = {
    "displayName": "Get Axidraw Object",
    "inports": {},
    "outports": {"ad": {"displayName": "axidraw Object", "description": ""}},
}


class GetAxidraw(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)
        self.pos = (0, 0)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("Connecting to Axidraw")

    def connect(self, args):
        ad = axidraw.AxiDraw()
        ad.interactive()
        ad.connect()
        ad.moveto(1, 1)
        # self.updateOutports({"ad": ad})

    def move(self, args):
        if args["dir"] == "x":
            self.pos = (self.pos[0] + args["amt"], self.pos[1])
        elif args["dir"] == "y":
            self.pos = (self.pos[0], self.pos[1] + args["amt"])

        self.ad.moveto(self.pos[0], self.pos[1])
