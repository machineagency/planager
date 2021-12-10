from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "JPEG Viewer",
    "inports": {"imIn": {"displayName": "Image in", "description": "image in inport"}},
    "outports": {
        "imOut": {"displayName": "Image out", "description": "image out outport"}
    },
}


class ImageViewer(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        # Pass through the image value
        self.updateOutports({"imOut": self.inports["imIn"].getValue()})
