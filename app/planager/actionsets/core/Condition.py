from ...workflow.Action import Action

CONFIG = {
    "displayName": "If/Else",
    "inports": {
        "condition": {
            "displayName": "Input Condition",
            "description": "Input condition.",
        }
    },
    "outports": {
        "c1": {"displayName": "If", "description": "Condition one."},
        "c2": {"displayName": "Else", "description": "Condition two."},
    },
}


class Condition(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):

        val = self.inports["condition"].getValue()

        if val == None:
            # No input
            self.outports["c1"].setValue(None)
            self.outports["c2"].setValue(None)
        elif val == True:
            # Condition is True
            self.outports["c1"].setValue(True)
            self.outports["c2"].setValue(None)
        elif val == False:
            # Condition is False
            self.outports["c1"].setValue(False)
            self.outports["c2"].setValue(None)
        else:
            # Invalid input
            self.outports["c1"].setValue(None)
            self.outports["c2"].setValue(None)

        return {"outports": self.outports}