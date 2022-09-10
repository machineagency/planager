from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Scripting.tool")) as json_file:
    CONFIG = json.load(json_file)


class Scripting(Tool, config=CONFIG):
    # def inports_updated(self, inportID):
    #     print(self.inports["vars"])

    def edit_script(self, new_script):
        print(new_script)

    def set_live(self, live):
        print(live)
