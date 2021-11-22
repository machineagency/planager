from ....workflow.Action import Action

CONFIG = {
    "displayName": "TemplateAction",
    "inports": {
        "templateInput": {
            "displayName": "TemplateActiont",
            "description": "TemplateAction"
        }
    },
    "outports": {
         "templateOutput": {
            "displayName": "TemplateAction",
            "description": "TemplateAction"
        }
    },
}


class TemplateAction(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")

    def templateActionMethod(self, options):
        print("template method")
