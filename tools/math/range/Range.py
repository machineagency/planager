from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Range.tool")) as json_file:
    CONFIG = json.load(json_file)


class Range(Action, config=CONFIG):
    def inports_updated(self, inportID):
        if (
            not self.inports["start"]
            or not self.inports["stop"]
            or not self.inports["step"]
        ):
            return
        self.outports["range"] = list(
            range(
                int(self.inports["start"]),
                int(self.inports["stop"]),
                int(self.inports["step"]),
            )
        )
