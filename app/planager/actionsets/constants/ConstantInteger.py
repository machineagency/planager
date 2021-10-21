from ...workflow.Action import Action

CONFIG = {
    "displayName": "Int",
    "inports": {},
    "outports": {
        "res": {
            "displayName": "Integer",
            "description": "Constant integer",
            "value": None,
        }
    },
    "userInput": {
        "int": {
            "type": "int",
            "displayName": "Integer",
            "description": "Integer to set as constant.",
            "value": None,
        }
    },
}


class ConstantInteger(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        print("INT")
        return {"outports": self.outports}

    def handleInput(self, newInt):
        try:
            assert type(newInt) == int
            self.outports["res"].value = newInt
        except AssertionError:
            print("not an integer")
            self.outports["res"].value = None
        except:
            print("Something else went wrong.")
            self.outports["res"].value = None
        return {"outports": self.outports}


if __name__ == "__main__":
    cint = ConstantInteger()
    cint.handleInput(7)