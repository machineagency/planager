from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Editor",
    "inports": {},
    "outports": {
        "output": {
            "displayName": "Output",
            "description": "The output text from the editor.",
        }
    },
}


class Editor(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")

    def save(self, args):
        # TODO: should set the mime type here so this can be universal
        self.updateOutports({"output": args["output"]})
