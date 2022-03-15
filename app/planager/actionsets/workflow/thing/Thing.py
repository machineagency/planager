from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Thing",
    "inports": {},
    "outports": {
        "thingName": {
            "displayName": "thingName",
            "description": "thingName",
        }
    },
}


class Thing(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
