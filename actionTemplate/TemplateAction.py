from planager.Action import Action

CONFIG = {
    "displayName": "TemplateAction",
    "inports": {
        "templateInput": {
            "displayName": "TemplateAction",
        }
    },
    "outports": {
        "templateOutput": {
            "displayName": "TemplateAction",
        }
    },
}


class TemplateAction(Action, config=CONFIG):
    pass
