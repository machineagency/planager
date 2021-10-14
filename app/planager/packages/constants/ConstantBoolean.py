from ...workflow.Action import Action

CONFIG = {
    "displayName": "Constant Boolean",
    "agent": None,
    "id": None,
    "inports": {},
    "outports": {
        "res": {
            "displayName": "Boolean",
            "description": "Resulting boolean.",
            "value": None,
        }
    },
    "userInput": {
        "int": {
            "type": "bool",
            "displayName": "Boolean",
            "description": "Boolean to set as constant.",
            "value": None,
        }
    },
    "errorState": False,
    "errorMessage": None,
}


class ConstantBoolean(Action):
    def __init__(self):
        # TODO: parent class should have a method to unpack the config
        self.d = CONFIG

    def main(self):

        return {"outports": self.d.outports}

    def setConstantBoolean(self, newInt):
        try:
            assert type(newInt) == bool
            self.d.outports.res.value = newInt
        except AssertionError:
            print("Value should be an integer.")
            self.d.outports.res.value = None
        except:
            print("Something else went wrong.")
            self.d.outports.res.value = None
        return {"outports": self.d.outports}

    def updateConfig(self, config):
        # TODO: should be in parent class
        self.d = config
        return {"config": self.d.config}
