from planager.Action import Action

CONFIG = {
    "displayName": "JSON Viewer",
    "inports": {"data": {"displayName": "data"}},
    "outports": {
        "data": {
            "displayName": "data",
        }
    },
    "state": {"data": {"boo": "yah"}},
}


class JsonViewer(Action, config=CONFIG):
    pass
