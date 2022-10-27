from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "AxidrawPlot.tool")) as json_file:
    CONFIG = json.load(json_file)

from pyaxidraw import axidraw

# MODELS: Axidraw SE: 2, travel 430, 297
#        Axidraw minikit: 4, travel 160, 101.6


class AxidrawPlot(Tool, config=CONFIG):
    def setup(self):
        self.ad = axidraw.AxiDraw()

    def plot_common(self):
        self.ad.options.model = 2
        self.ad.options.reordering = 2

    def preview(self, arg):
        if not self.ad or not self.inports["svg"]:
            return

        self.ad.plot_setup(self.inports["svg"])
        self.ad.options.preview = True
        self.plot_common()

        output_svg = self.ad.plot_run(True)
        self.outports["preview"] = output_svg

    def run(self, arg):
        if not self.ad or not self.inports["svg"]:
            return

        self.ad.plot_setup(self.inports["svg"])
        self.plot_common()
        self.ad.plot_run()
