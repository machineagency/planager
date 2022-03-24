from planager.Action import Action

CONFIG = {
    "displayName": "Text",
    "inports": {},
    "outports": {
        "text": {
            "displayName": "text",
            "description": "text",
        }
    },
}


class Text(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
