from ...workflow.Action import Action

CONFIG = {
    "displayName": "Window",
    "inports": {
        "in": {
            "displayName": "In",
            "description": "The value going into the window",
        }
    },
    "outports": {
        "out": {
            "displayName": "Out",
            "description": "The value coming out",
        }
    },
}


class Window(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        # Takes the inports does nothing, passes to the outport
        print("WINDOW")
        self.outports["out"].value = self.inports["in"].value
        return {"outports": self.outports}
