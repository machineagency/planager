from Action import Action

CONFIG = {
    "displayName": "Example",
    "inports": {
        "ex": {
            "displayName": "Example",
            "description": "Example inport"}
    },
    "outports": {
        "ex": {
            "displayName": "Example",
            "description": "Example outport"}
    },
}


class Example(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("Inside example action")
