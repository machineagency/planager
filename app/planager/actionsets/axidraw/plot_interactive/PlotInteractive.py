from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "PlotInteractive",
    "inports": {
        "templateInput": {
            "displayName": "TemplateAction",
            "description": "TemplateAction",
        }
    },
    "outports": {
        "machineOut": {
            "displayName": "machine out",
            "description": "data from machine",
        }
    },
}


class PlotInteractive(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
        # from pyaxidraw import axidraw  # import module

        # self.ad = axidraw.AxiDraw()  # Initialize class
        # self.ad.interactive()  # Enter interactive context
        # self.ad.connect()  # Open serial port to AxiDraw
        # self.ad.moveto(1, 1)
        # Absolute moves follow:
        # ad.moveto(1, 1)  # Pen-up move to (1 inch, 1 inch)
        # ad.lineto(2, 1)  # Pen-down move, to (2 inch, 1 inch)
        # ad.moveto(0, 0)  # Pen-up move, back to origin.
        # ad.disconnect()  # Close serial port to AxiDraw

    def connect(self, args):
        from pyaxidraw import axidraw  # import module

        self.ad = axidraw.AxiDraw()  # Initialize class
        self.ad.interactive()  # Enter interactive context
        self.ad.connect()  # Open serial port to AxiDraw
        print("HELLOOOOOOO")
        self.ad.moveto(1, 1)

    def move_to(self):
        self.ad.moveto(1, 1)

    def line_to(self):
        self.ad.lineto(2, 1)
