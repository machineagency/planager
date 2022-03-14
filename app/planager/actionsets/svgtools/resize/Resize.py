from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Resize jpeg",
    "inports": {
        "imageIn": {"displayName": "input image", "description": "input image"}
    },
    "outports": {
        "resizedImage": {"displayName": "resized image", "description": "resized image"}
    },
}


class Resize(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
        pass
