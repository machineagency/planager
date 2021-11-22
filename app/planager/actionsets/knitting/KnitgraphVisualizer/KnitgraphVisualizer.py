from ....workflow.Action import Action
from ..utils.debugging_tools.knit_graph_viz import visualize_knitGraph

CONFIG = {
    "displayName": "Knitgraph Visualizer",
    "inports": {
        "knitgraphIn": {
            "displayName": "Knitgraph Input",
            "description": "A knitgraph to visualize"
        }
    },
    "outports": {
         "knitgraphOut": {
            "displayName": "Knitgraph Output",
            "description": "The resulting knitgraph (unmodified)"
        }
    },
}


class KnitgraphVisualizer(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        pass

    def graph(self, options):
        graph = self.inports["knitgraphIn"].getValue()
        if graph:
            viz = visualize_knitGraph(self.inports["knitgraphIn"].getValue(), "cables.html")
            self.outports["knitgraphOut"].setValue(graph)
            return viz
        return {}