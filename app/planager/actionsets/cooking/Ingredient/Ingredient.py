from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "ingredient",
    "inports": {},
    "outports": {
        "ingredient": {
            "displayName": "ingredient",
            "description": "ingredient",
        }
    },
}


class Ingredient(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")

    def templateActionMethod(self, options):
        print("template method")
