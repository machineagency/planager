from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Axidraw Options",
    "inports": {},
    "outports": {"options": {"displayName": "output options", "description": ""}},
}


class Options(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
        pass
