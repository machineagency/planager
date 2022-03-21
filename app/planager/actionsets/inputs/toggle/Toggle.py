from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Toggle",
    "inports": {},
    "outports": {
        "toggle": {
            "displayName": "toggle",
            "description": "toggle",
        }
    },
}


class Toggle(Action, config=CONFIG):
    pass
