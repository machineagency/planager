from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Shopbot.tool")) as json_file:
    CONFIG = json.load(json_file)


class Shopbot(Tool, config=CONFIG):
    SPINDLE_ON = "C6"
    SPINDLE_OFF = "C7"

    def rapid(self, dir, amt):
        return f"{dir}, {amt}"

    def move(self, dir, amt):
        return f"{dir}, {amt}"

    def setup(self):
        pass
