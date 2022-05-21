from planager.Action import Action

CONFIG = {
    "displayName": "Download",
    "inports": {
        "fileContents": {
            "displayName": "File Contents",
        },
        "fileName": {
            "displayName": "File Name",
        },
        "fileType": {
            "displayName": "File Type",
        },
    },
    "outports": {},
}


class Download(Action, config=CONFIG):
    pass
    # def main(self):
    #     self.updateOutports({"file": self.inports["file"].getValue()})

    # @Action.onInportUpdate("file")
    # def receive(self):
    #     self.updateOutports({"file": self.inports["file"].getValue()})
