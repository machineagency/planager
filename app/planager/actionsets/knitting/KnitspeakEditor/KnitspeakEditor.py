from ....workflow.Action import Action

CONFIG = {
    "displayName": "Knitspeak Editor",
    "inports": {},
    "outports": {
         "knitspeak": {
            "displayName": "KnitSpeak",
            "description": "A knitspeak program"
        }
    },
}


class KnitspeakEditor(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")

    def save(self, options):
        self.updateOutports({"knitspeak": options['knitspeak']})
