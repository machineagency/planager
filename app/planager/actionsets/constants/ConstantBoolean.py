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
        "bool": {
            "displayName": "Boolean",
            "description": "Boolean to set as constant.",
        }
    },
}


class ConstantBoolean(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        return {"outports": self.outports}

    def handleInput(self, newBool):
        """Handles user input to this action.

        Ensures that the input is a boolean, updates the current value, and
        sends it to the outport.

        Args:
            newBool (boolean): the input boolean.

        Returns:
            dict: A dictionary containing the updated outports.
        """
        try:
            assert isinstance(newBool, bool)
            self.outports["res"].setValue(newBool)
        except AssertionError:
            print("Value should be an integer.")
            self.outports["res"].setValue(None)
        except BaseException:
            print("Something else went wrong.")
            self.outports["res"].setValue(None)
        return {"outports": self.outports}
