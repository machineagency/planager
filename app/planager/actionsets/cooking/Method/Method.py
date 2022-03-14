from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "method",
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


class Method(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
        # print(self.inports["ingredients"].getValue())
