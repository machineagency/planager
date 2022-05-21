from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "JsonViewer.tool")) as json_file:
    CONFIG = json.load(json_file)


class JsonViewer(Action, config=CONFIG):
    @Action.onInportUpdate("jsonData")
    def jsonUpdated(self, newJSON):
        print("got some data")
        print(newJSON)
