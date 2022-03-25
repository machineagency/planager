from planager.Action import Action

CONFIG = {
    "displayName": "Number",
    "inports": {},
    "outports": {
        "number": {
            "displayName": "Number",
        }
    },
    "state": {"number": 10},
}


class Num(Action, config=CONFIG):
    def updateNumber(self, newNum):
        self.state["number"] = newNum
        self.updateOutports({"number": self.state["number"]})
