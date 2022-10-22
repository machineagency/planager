from planager.Action import Action

CONFIG = {
    "displayName": "RecordArray",
    "inports": {"input": {"displayName": "input"}},
    "outports": {
        "recordedArray": {
            "displayName": "array",
        }
    },
    "state": {"length": 10, "current": []},
}


class RecordArray(Action, config=CONFIG):
    def receivedData(self, inportID):
        self.state["current"].append(self.inports["input"].value)
        if len(self.state["current"]) == self.state["length"]:
            self.updateOutports({"recordedArray": self.state["current"]})
            self.state["current"] = []

    def updateLength(self, newLen):
        self.state["length"] = int(newLen)
        if len(self.state["current"]) > self.state["length"]:
            self.updateOutports({"recordedArray": self.state["current"][:newLen]})
            self.state["current"] = []
