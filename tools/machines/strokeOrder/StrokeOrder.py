from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "StrokeOrder.tool")) as json_file:
    CONFIG = json.load(json_file)


class StrokeOrder(Tool, config=CONFIG):
    def inports_updated(self, inportID):
        # self.state["paths"] = self.inports["stroke"]
        self.intersperse()

    def intersperse(self):
        # if not (self.inports["moves"] and self.inports["intersperse"]):
        #     return
        if not self.inports["moves"]:
            return
        queue = []
        for move in self.inports["moves"]:
            queue.append(["m", 0, 0])
            queue.append(move)
        # print(queue)
        self.outports["moves"] = queue
