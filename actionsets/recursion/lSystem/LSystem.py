from planager.Action import Action

CONFIG = {
    "displayName": "L-System",
    "inports": {
        "rule": {
            "displayName": "Rule",
        }
    },
    "outports": {
        "path": {
            "displayName": "L-System Path",
        }
    },
    "state": {"rule": "LL"},
}


class LSystem(Action, config=CONFIG):
    pass
