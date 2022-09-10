from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "ImageViewer.tool")) as json_file:
    CONFIG = json.load(json_file)


class ImageViewer(Tool, config=CONFIG):
    def inports_updated(self, port):
        self.state["imageURL"] = self.inports["imageURL"]
