from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "Svg2Pes.tool")) as json_file:
    CONFIG = json.load(json_file)


class Svg2Pes(Tool, config=CONFIG):
    pass
