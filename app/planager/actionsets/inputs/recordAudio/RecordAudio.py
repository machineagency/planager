from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "RecordAudio",
    "inports": {},
    "outports": {
        "audio": {
            "displayName": "audio",
            "description": "text",
        }
    },
}


class RecordAudio(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
