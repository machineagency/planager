from planager.Action import Action

CONFIG = {
    "displayName": "JPEG Viewer",
    "inports": {"imIn": {"displayName": "Image in", "description": "image in inport"}},
    "outports": {
        "imOut": {"displayName": "Image out", "description": "image out outport"}
    },
}


class ImageViewer(Action, config=CONFIG):
    def main(self):
        # Pass through the image value
        self.updateOutports({"imOut": self.inports["imIn"].getValue()})
