from planager.Tool import Tool
from pyembroidery import *
from rich import print
from svgpathtools import svg2paths, wsvg
import numpy as np
import pygcode


CONFIG = {
    "displayName": "SVG to G-code",
    "inports": {
        "svg": {"displayName": "svg"},
    },
    "outports": {
        "gcode": {"displayName": "pes"},
    },
    "state": {},
}


class Svg2Gcode(Tool, config=CONFIG):
    def setup(self):
        print("yolo")
