from ...workflow.Action import Action

CONFIG = {
    "displayName": "Constant Boolean",
    "inports": {},
    "outports": {
        "res": {
            "displayName": "Boolean",
            "description": "Resulting boolean.",
        }
    },
    "userInput": {
        "int": {
            "displayName": "Boolean",
            "description": "Boolean to set as constant.",
        }
    },
}


class ConstantBoolean(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        return

    def setConstantBoolean(self, newInt):
        try:
            assert type(newInt) == bool
            self.outports.res.value = newInt
        except AssertionError:
            print("Value should be an integer.")
            self.outports.res.value = None
        except:
            print("Something else went wrong.")
            self.outports.res.value = None
        return {"outports": self.d.outports}
