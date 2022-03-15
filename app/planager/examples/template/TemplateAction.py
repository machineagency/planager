from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "TemplateAction",
    "inports": {
        "templateInput": {
            "displayName": "TemplateAction",
            "description": "TemplateAction",
        }
    },
    "outports": {
        "templateOutput": {
            "displayName": "TemplateAction",
            "description": "TemplateAction",
        }
    },
}


class TemplateAction(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
