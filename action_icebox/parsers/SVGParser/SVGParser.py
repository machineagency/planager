from ....workflow.Action import Action

CONFIG = {
    "displayName": "SVG Parser",
    "inports": {},
    "outports": {},
}


class SVGParser(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("Inside SVG parser")
        self.displayText = "connection, could put more info here"
        return {"text": self.displayText}
