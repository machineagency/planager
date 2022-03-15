from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "RecordArray",
    "inports": {},
    "outports": {
        "recordedArray": {
            "displayName": "text",
            "description": "text",
        }
    },
}


class RecordArray(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
