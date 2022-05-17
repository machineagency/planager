from planager.Action import Action

CONFIG = {
    "displayName": "Editor",
    "inports": {"vars": {"displayName": "Variables", "multi": True}},
    "outports": {
        "output": {
            "displayName": "Output",
        },
        "eval": {"displayName": "Evaluated program"},
    },
    "state": {
        "mode": "python",
        "text": "print('hello world')",
        "live": False,
        "varMap": {},
        "eval": None,
    },
}


class Editor(Action, config=CONFIG):
    def save(self, text):
        # TODO: should set the mime type here so this can be universal
        self.state["text"] = text
        self.evaluate(None)
        self.updateOutports({"output": self.state["text"]})

    def changeMode(self, mode):
        self.state["mode"] = mode

    def receivedData(self, id):
        for key, value in self.inports["vars"].value.items():
            self.state["varMap"].setdefault(key, {"val": value, "name": key})
            self.state["varMap"][key]["val"] = value

        self.evaluate(None)

    def updateVarName(self, args):
        self.state["varMap"][args["id"]]["name"] = args["newName"]
        self.updateSelf()

    def evaluate(self, args):
        vars = {}
        for value in self.state["varMap"].values():
            vars[value["name"]] = value["val"]
        self.state["eval"] = eval(self.state["text"], vars)
        self.updateOutports({"eval": self.state["eval"]})
        self.updateSelf()
