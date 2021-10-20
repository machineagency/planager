from ...workflow.Action import Action

CONFIG = {
    "displayName": "Constant Integer",
    "agent": None,
    "id": None,
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
    "errorState": False,
    "errorMessage": None,
}


class ConstantInteger(Action):
    def __init__(self):
        Action.__init__(self)
        self.displayName = "Integer"
        config = CONFIG

    def main(self):
        return {"outports": self.d.outports}

    def setConstantInteger(self, newInt):
        try:
            assert type(newInt) == int
            self.d.outports.res.value = newInt
        except AssertionError:
            print("not an integer")
            self.d.outports.res.value = None
        except:
            print("Something else went wrong.")
            self.d.outports.res.value = None
        return {"outports": self.d.outports}
