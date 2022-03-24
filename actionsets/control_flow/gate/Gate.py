from planager.Action import Action

CONFIG = {
    "displayName": "Gate",
    "inports": {
        "in": {
            "displayName": "in",
        }
    },
    "outports": {
        "out": {
            "displayName": "out",
        }
    },
    "state": {"open": False},
}


class Gate(Action, config=CONFIG):
    def setGate(self, state):
        self.state["open"] = state
        self.updateOutportsFromState()

    def updateOutportsFromState(self):
        if self.state["open"]:
            self.updateOutports({"out": self.inports["in"].value})
        else:
            self.updateOutports({"out": None})

    def receivedData(self, inportID):
        if inportID == "in":
            self.updateOutportsFromState()
