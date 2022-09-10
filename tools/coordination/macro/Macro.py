from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Macro.tool")) as json_file:
    CONFIG = json.load(json_file)


class Macro(Tool, config=CONFIG):
    def reorder(self):
        pass
