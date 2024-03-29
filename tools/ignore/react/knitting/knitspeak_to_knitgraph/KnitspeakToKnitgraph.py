from app.planager.workflow.Action import Action

# TODO: standardize a way of importing things to actionsets
from app.planager.actionsets.knitting.utils.knitspeak_compiler.knitspeak_compiler import (
    Knitspeak_Compiler,
)

CONFIG = {
    "displayName": "Knitspeak Compiler",
    "inports": {
        "knitspeak": {
            "displayName": "Knitspeak Input",
            "description": "A string containing a knitspeak pattern.",
        }
    },
    "outports": {
        "knitgraph": {
            "displayName": "knitgraph",
            "description": "The resulting knitgraph",
        }
    },
}


class KnitspeakToKnitgraph(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)
        self.shouldOutportsUpdate = False

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")

    def compile(self, options):
        pattern = self.inports["knitspeak"].getValue()
        # print(self.inports["knitspeak"])
        # print(pattern)
        if pattern:
            compiler = Knitspeak_Compiler()
            knit_graph = compiler.compile(11, 6, pattern)
            self.updateOutports({"knitgraph": knit_graph})
