from ...workflow.Action import Action

CONFIG = {
    "displayName": "Axidraw Controller",
    "inports": {
        "condition": {
            "displayName": "Input Condition",
            "description": "Input condition.",
        }
    },
    "outports": {
        "c1": {"displayName": "One", "description": "Condition one."},
        "c2": {"displayName": "Two", "description": "Condition two."},
    },
}


class AxidrawController(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("axidraw controller action run in the backend")
        self.displayText = ("ran the controller")
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
