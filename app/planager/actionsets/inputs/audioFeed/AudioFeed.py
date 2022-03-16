from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Audio Feed",
    "inports": {
        "audioDevice": {
            "displayName": "Audio Device ID",
            "description": "Audio device ID",
        },
    },
    "outports": {
        "recording": {"displayName": "recording", "description": "recording"},
    },
}


class AudioFeed(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
