from ...workflow.Action import Action

CONFIG = {
    "displayName": "Minus",
    "outports": {
        "result": {
            "displayName": "Result",
            "description": "Result.",
        }
    },
    "inports": {
        "num1": {"displayName": "Num 1", "description": "Number one."},
        "num2": {"displayName": "Num 2", "description": "Number two."},
    },
    "display": "No input!",
}


class Minuser(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        try:
            result = self.inports["num1"].getValue() - self.inports["num2"].getValue()
        except:
            result = None

        self.outports["result"].setValue(result)

        self.display(
            "{num1} minus {num2} equals {result}!".format(
                num1=self.inports["num1"],
                num2=self.inports["num2"],
                result=self.outports["result"],
            )
        )
        return
