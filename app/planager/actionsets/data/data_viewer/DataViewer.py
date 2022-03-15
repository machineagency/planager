from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Data Viewer",
    "inports": {"data": {"displayName": "data", "description": "data", "multi": True}},
    "outports": {"data": {"displayName": "data", "description": "data"}},
}


class DataViewer(Action, config=CONFIG):
    def main(self):
        """Passes the data object through."""
        self.updateOutports({"data": self.inports["data"].getValue()})
