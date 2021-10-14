from ...workflow.Action import Action

CONFIG = {
    "displayName": "Window",
    "agent": None,
    "id": None,
    "inports": {
        "in": {
            "displayName": "In",
            "description": "In",
            "value": None,
        }
    },
    "outports": {
        "out": {
            "displayName": "Out",
            "description": "Out",
            "value": None,
        }
    },
    "display": {
        "value": "outports.out.value"
    }
}


class Window(Action):
    def __init__(self):
        # TODO: parent class should have a method to unpack the config
        self.d = CONFIG

    def main(self):
        self.d.outports["out"].value = self.d.inports["in"].value
        return {"outports": self.d.outports}

    def clear(self):
        self.d.outports["out"].value = None
        self.d.inports["in"].value = None
        return {"config": self.d}