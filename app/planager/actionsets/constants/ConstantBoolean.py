from ...workflow.Action import Action

CONFIG = {
    "displayName": "Bool",
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
        print("BOOL")
        return {"outports": self.outports}

    def handleInput(self, newInt):
        try:
            assert type(newInt) == bool
            self.outports["res"].setValue(newInt)
        except AssertionError:
            print("Value should be an integer.")
            self.outports["res"].setValue(None)
        except:
            print("Something else went wrong.")
            self.outports["res"].setValue(None)
        return {"outports": self.outports}
