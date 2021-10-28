from ...workflow.Action import Action

CONFIG = {
    "displayName": "Add",
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


class Adder(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        # Number one minus number two
        try:
            result = self.inports["num1"].getValue(
            ) + self.inports["num2"].getValue()
        except BaseException:
            result = None

        self.outports["result"].setValue(result)

        self.display(
            "{num1} plus {num2} equals {result}!".format(
                num1=self.inports["num1"],
                num2=self.inports["num2"],
                result=self.outports["result"],
            )
        )

        return
