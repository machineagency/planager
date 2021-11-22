from ....workflow.Action import Action
from ..utils.knitspeak_compiler.knitspeak_compiler import Knitspeak_Compiler

CONFIG = {
    "displayName": "Knitspeak Compiler",
    "inports": {
        "knitspeak": {
            "displayName": "Knitspeak Input",
            "description": "A string containing a knitspeak pattern."
        }
    },
    "outports": {
         "knitgraph": {
            "displayName": "knitgraph",
            "description": "The resulting knitgraph"
        }
    },
}


class KnitspeakToKnitgraph(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")

    def compile(self, options):
        pattern = r"""
            1st row k, lc2|2, k, rc2|2, [k] to end.
            all ws rows p.
            3rd row k 2, lc2|1, k, rc1|2, [k] to end.
            5th row k 3, lc1|1, k, rc1|1, [k] to end.
        """
        compiler = Knitspeak_Compiler()
        knit_graph = compiler.compile(11, 6, pattern)
        # visualize_knitGraph(knit_graph, "cables.html")

        self.updateOutports({"knitgraph": knit_graph})
