from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "PixelArt.tool")) as json_file:
    CONFIG = json.load(json_file)


class PixelArt(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")
