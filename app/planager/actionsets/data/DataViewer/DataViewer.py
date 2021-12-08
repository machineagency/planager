from ....workflow.Action import Action

CONFIG = {
    "displayName": "Data Viewer",
    "inports": {"data": {"displayName": "data", "description": "data"}},
    "outports": {"data": {"displayName": "data", "description": "data"}},
}


class DataViewer(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        self.updateOutports({"data": self.inports["data"].getValue()})
