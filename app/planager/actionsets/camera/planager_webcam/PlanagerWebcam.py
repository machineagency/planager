from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Planager Webcam",
    "inports": {},
    "outports": {
        "image": {
            "displayName": "Still image",
            "description": "The still image captured by the webcam.",
            "mimeType": (".jpg", ".png"),
        },
        "video": {"displayName": "Video", "description": "Live video feed."},
    },
}


class PlanagerWebcam(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        print("Inside webcam")

    def take_picture(self, image):
        self.updateOutports({"image": image})
