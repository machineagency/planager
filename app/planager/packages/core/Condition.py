from flask import config
from ...workflow.Action import Action

CONFIG = {
    "displayName": "If",
    "agent": None,
    "id": None,
    "inports": {
        "condition": {
            "displayName": "Input Condition",
            "description": "Input condition.",
            "value": None,
        }
    },
    "outports": {
        "c1": {"displayName": "One", "description": "Condition one.", "value": None},
        "c2": {"displayName": "Two", "description": "Condition two.", "value": None},
    },
}


class Condition(Action):
    config = CONFIG
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

    def updateConfig(self, config):
        # TODO: should be in parent class
        self.d = config
        return {"config": self.d.config}

    def updateInport(self, inport, val):
        # TODO: should be in parent class
        self.d.inports[inport].value = val
        return {"inports": self.d.inports}
