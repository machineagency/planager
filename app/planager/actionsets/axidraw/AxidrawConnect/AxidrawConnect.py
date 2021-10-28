from ....workflow.Action import Action

# import .pyaxidraw

CONFIG = {
    "displayName": "Axidraw Connect",
    "inports": {},
    "outports": {},
}


class AxidrawConnect(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        # pyaxidraw
        print("Connecting to Axidraw")
        self.displayText = "connection, could put more info here"
        return {"text": self.displayText}

    def connect(self):
        print("CONNECTING TO AXIDRAW")
