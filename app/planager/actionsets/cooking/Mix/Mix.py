from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "mix",
    "inports": {
        "ingredients": {
            "displayName": "ingredients",
            "description": "ingredient",
            "multi": True,
        },
        "tools": {"displayName": "tools", "description": "tools", "multi": True},
        "conditions": {
            "displayName": "conditions",
            "description": "conditions",
            "multi": True,
        },
    },
    "outports": {
        "state": {
            "displayName": "state",
            "description": "state",
        }
    },
}


class Mix(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")

    def templateActionMethod(self, options):
        print("template method")
