from ....workflow.Action import Action

CONFIG = {
    "displayName": "Axidraw Options",
    "inports": {},
    "outports": {
        "options": {
            "displayName": "output options",
            "description": ""
        }
    },
}


class Options(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        pass
