from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Upload",
    "inports": {},
    "outports": {
        "file": {
            "displayName": "Uploaded file",
            "description": "the uploaded file",
        }
    },
}


class Upload(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
