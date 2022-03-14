# from pyaxidraw import axidraw
from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Draw SVG",
    "inports": {
        "svg": {
            "displayName": "SVG input",
            "description": "SVG to draw on the Axidraw",
        },
        "options": {
            "displayName": "options",
            "description": "SVG to draw on the Axidraw",
        },
    },
    "outports": {},
}


class DrawSVG(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main axi draw")

    def draw(self, options):
        ad = axidraw.AxiDraw()
        ad.plot_setup(self.inports["svg"].value)
        if self.inports["options"].value:
            for option, value in self.inports["options"].value.items():
                ad[option] = value
        ad.plot_run()
