from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "SvgViewer.tool")) as json_file:
    CONFIG = json.load(json_file)


class SvgViewer(Action, config=CONFIG):
    pass
    # def inports_updated(self, port):
    #     port_handlers = {"svg": self.svg}
    #     port_handlers[port]()

    # def svg(self):
    #     self.state["path"] = self.inports["path"]
    #     print(self.state["path"])
