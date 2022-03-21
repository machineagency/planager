from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Slider",
    "inports": {},
    "outports": {
        "val": {
            "displayName": "val",
            "description": "val",
        }
    },
}


class Slider(Action, config=CONFIG):
    pass
