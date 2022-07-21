from planager.Action import Action

CONFIG = {
    "displayName": "Text",
    "inports": {},
    "outports": {
        "text": {
            "displayName": "text",
        }
    },
    "state": {"textValue": "default value"},
}


class Text(Action, config=CONFIG):
    def init(self):
        self.updateOutports({"text": self.state["textValue"]})

    def updateText(self, newText):
        self.state["textValue"] = newText
        self.updateOutports({"text": self.state["textValue"]})
