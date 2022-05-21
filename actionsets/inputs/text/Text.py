from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Text.tool")) as json_file:
    CONFIG = json.load(json_file)


class Text(Action, config=CONFIG):
    state_handlers = {"text": "textUpdated"}

    def textUpdated(self, textValue):
        print(textValue)
