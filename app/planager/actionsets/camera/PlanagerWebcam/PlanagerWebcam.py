from ....workflow.Action import Action

CONFIG = {
    "displayName": "Planager Webcam",
    "inports": {},
    "outports": {
        "image": {
            "displayName": "Still image",
            "description": "The still image captured by the webcam."},
        "video": {
            "displayName": "Video",
            "description": "Live video feed."},
    },
}


class PlanagerWebcam(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("Inside webcam")
        self.displayText = "Webcam, could put more info here"
        return {"text": self.displayText}
