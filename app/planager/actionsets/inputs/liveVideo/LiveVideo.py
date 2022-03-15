from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Video Feed",
    "inports": {
        "video": {"displayName": "video", "description": "video"},
    },
    "outports": {
        "video": {"displayName": "video", "description": "video"},
    },
}


class LiveVideo(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
