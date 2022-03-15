from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "method",
    "inports": {
        "inputs": {
            "displayName": "inputs",
            "description": "inputs",
            "multi": True,
        }
    },
    "outports": {
        "outputs": {
            "displayName": "outputs",
            "description": "outputs",
        }
    },
}


class Method(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
        # print(self.inports["ingredients"].getValue())

    def createNewInport(self, options):
        new_name = options["newInportName"]
        self.addInport(
            new_name, {"displayName": new_name, "description": new_name, "multi": True}
        )

    def createNewOutport(self, options):
        new_name = options["newOutportName"]
        self.addOutport(new_name, {"displayName": new_name, "description": new_name})
