from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Canvas.tool")) as json_file:
    CONFIG = json.load(json_file)


class Canvas(Tool, config=CONFIG):
    def capture_position(self, pos):
        self.outports["position"] = pos

    def inports_updated(self, inportID):
        port_handlers = {"dimensions": self.dims, "objects": self.objs}
        port_handlers[inportID]()

    def dims(self):
        self.state["width"] = self.inports["dimensions"][0]
        self.state["height"] = self.inports["dimensions"][1]

    def objs(self):
        pass
