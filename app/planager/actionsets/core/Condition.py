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
        print("main")
        if self.d.inports.condition.value == None:
            # No input
            self.d.outports.c1.value = None
            self.d.outports.c2.value = None
        elif self.inports.condition.value == True:
            # Condition is True
            self.d.outports.c1.value = True
            self.d.outports.c2.value = False
        elif self.inports.condition.value == False:
            # Condition is False
            self.d.outports.c1.value = False
            self.d.outports.c2.value = True
        else:
            # Invalid input
            self.d.outports.c1.value = None
            self.d.outports.c2.value = None
        return {"outports": self.d.outports}
