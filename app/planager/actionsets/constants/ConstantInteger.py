from ...workflow.Action import Action

CONFIG = {
    "displayName": "Int",
    "inports": {},
    "outports": {
        "int": {
            "displayName": "Integer",
            "description": "Constant integer",
        }
    },
    "userInput": {
        "int": {
            "type": "int",
            "displayName": "Integer",
            "description": "Integer to set as constant.",
        }
    },
}


class ConstantInteger(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        print("you're in the main method of INT")

    def handleInput(self, newInt):
        try:
            assert isinstance(newInt, int)
            self.outports["int"].value = newInt
        except AssertionError:
            print("not an integer")
            self.outports["int"].value = None
        except BaseException:
            print("Something else went wrong.")
            self.outports["int"].value = None
        return {"outports": self.outports}


if __name__ == "__main__":
    const_int = ConstantInteger()
    const_int.handleInput(7)
