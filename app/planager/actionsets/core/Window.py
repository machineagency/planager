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
        self.outports["out"].value = self.d.inports["in"].value
        return {"outports": self.d.outports}

    def clear(self):
        self.outports["out"].value = None
        self.inports["in"].value = None
        return {"config": self.d}
