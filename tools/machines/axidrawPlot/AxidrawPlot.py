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

#        xmlns:svg="http://www.w3.org/2000/svg"


class AxidrawPlot(Tool, config=CONFIG):
    def setup(self):
        self.ad = axidraw.AxiDraw()
        self.outports["dimensions"] = self.state[
            "dimensions"
        ]  # change for different models

    def preview(self, arg):
        if not self.ad or not self.inports["svg"]:
            return

        self.ad.plot_setup(self.inports["svg"])
        self.ad.options.preview = True
        self.ad.options.model = 2
        # self.ad.options.report_time = True
        output_svg = self.ad.plot_run(True)
        self.outports["preview"] = output_svg

    def run(self, arg):
        if not self.ad or not self.inports["svg"]:
            return

        self.ad.plot_setup(self.inports["svg"])
        self.ad.options.model = 2
        self.ad.plot_run()
