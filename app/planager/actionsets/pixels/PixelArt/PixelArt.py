from ....workflow.Action import Action

CONFIG = {
    "displayName": "PixelArt",
    "inports": {},
    "outports": {
        "pixelArt": {
            "displayName": "Pixel Artwork",
            "description": "2D array of pixel values",
        }
    },
}


class PixelArt(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")
