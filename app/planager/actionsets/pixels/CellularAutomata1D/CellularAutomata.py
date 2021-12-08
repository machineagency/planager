from ....workflow.Action import Action

CONFIG = {
    "displayName": "1D Cellular Automata",
    "inports": {},
    "outports": {
        "automata": {
            "displayName": "Generated automata",
            "description": "2D array of pixel values",
        }
    },
}


class CellularAutomata(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")
