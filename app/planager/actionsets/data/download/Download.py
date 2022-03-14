from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Download",
    "inports": {
        "file": {
            "displayName": "File",
            "description": "File to Download",
        }
    },
    "outports": {
        "file": {
            "displayName": "File",
            "description": "File to Download",
        }
    },
}


class Download(Action, config=CONFIG):
    def main(self):
        self.updateOutports({"file": self.inports["file"].getValue()})
