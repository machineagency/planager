from planager.Tool import Tool
from pyembroidery import *
from rich import print
from svgpathtools import svg2paths, wsvg
import numpy as np


CONFIG = {
    "displayName": "SVG to PES",
    "inports": {
        "svg": {"displayName": "svg"},
    },
    "outports": {
        "pes": {"displayName": "pes"},
    },
    "state": {},
}


class Svg2Pes(Tool, config=CONFIG):
    def setup(self):
        self.pattern = EmbPattern()

    def save_svg(self, fname=OUTPUT_SVG + "design.svg"):
        write_svg(self.pattern, fname)

    def save_pes(self, fname=OUTPUT_PES + "design.pes"):
        write_pes(self.pattern, fname)

    def add_stitch_block(self, block):
        self.pattern.add_block(block)

    def block_from_coords(self, coords):
        block = []
        for coord in coords:
            block.append((coord[0], coord[1]))
        self.pattern.add_block(block, "teal")

    def parse_svg(self, fname):
        paths, attributes = svg2paths(fname)
        print(paths)
        print(attributes)
        for path in paths:
            block = []
            for segment in path._segments:
                block.append((segment.start.real, segment.start.imag))
            block.append((path._segments[0].start.real, path._segments[0].start.imag))
            self.pattern.add_block(block, "teal")
