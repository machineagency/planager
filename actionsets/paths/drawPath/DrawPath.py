from planager.Action import Action

CONFIG = {
    "displayName": "Draw Path",
    "inports": {
        "path": {
            "displayName": "Path",
        }
    },
    "outports": {
        "path": {
            "displayName": "Path",
        }
    },
    "state": {"path": "M10 20 30 40 32 40"},
}


class DrawPath(Action, config=CONFIG):
    def receivedData(self, inportID):
        svgpath = "M"
        for x, y in self.inports["path"].value:
            svgpath += " ".join(x, y, "")

        self.state["path"] = svgpath
        self.updateOutports({"path", self.state.path})
