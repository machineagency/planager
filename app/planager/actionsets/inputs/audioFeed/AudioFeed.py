from app.planager.workflow.Action import Action
from rich import print
from rich.traceback import install

install()

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

    def printAudio(self, asdf):
        print(asdf)
