from .....workflow.Action import Action

# from pyaxidraw import axidraw


class AxidrawController(Action):
    def __init__(self):
        self.name = "axidraw"
        self.inports = {"config": {"data": "config file woo"}}
        self.outports = {"result": {"data": "some result data"}}
        self.description = "Axidraw controller"
        self.connected = False
        # self.ad = axidraw.AxiDraw()

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("axidraw action run in the backend")
        return

    # def connect(self):
    #     self.ad.interactive()
    #     self.ad.connect()
    #     self.connected = True
    #     return

    # def disconnect(self):
    #     self.ad.disconnect()
    #     self.connected = False

    # def test(self):
    #     # Runs a quick test script
    #     self.ad.moveto(1, 1)  # Pen-up move to (1 inch, 1 inch)
    #     # Pen-down move, to (2 inch, 1 inch)
    #     self.ad.lineto(2, 1)
    #     self.ad.moveto(0, 0)  # Pen-up move, back to origin.
    #     return

    # def togglePen(self):
    #     print("toggle")
    #     return
