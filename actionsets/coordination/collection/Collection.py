from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Collection.tool")) as json_file:
    CONFIG = json.load(json_file)


class Collection(Action, config=CONFIG):
    def inports_updated(self, inportID):
        self.state["candidate"] = self.inports["candidate"]

    def grab(self):
        self.state["candidate"][self.inports["name"]] = self.inports["candidate"]
