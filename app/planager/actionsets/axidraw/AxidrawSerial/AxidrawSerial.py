from ....workflow.Action import Action

CONFIG = {
    "displayName": "Axidraw Serial Connection",
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


class AxidrawSerial(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("axidraw serial action run in the backend")
        return
