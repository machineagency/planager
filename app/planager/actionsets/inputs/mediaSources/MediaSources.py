from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Media Sources",
    "inports": {},
    "outports": {
        "audio": {
            "displayName": "audio",
            "description": "text",
        },
        "video": {"displayName": "video", "description": "video"},
    },
}


class MediaSources(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
