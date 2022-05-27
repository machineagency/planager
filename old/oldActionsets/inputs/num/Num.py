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
    def init(self):
        self.updateOutports({"number": self.state["number"]})

    def updateNumber(self, newNum):
        self.state["number"] = int(newNum)
        self.updateOutports({"number": self.state["number"]})
