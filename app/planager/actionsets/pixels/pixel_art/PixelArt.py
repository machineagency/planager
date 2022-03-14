from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "PixelArt",
    "inports": {
        "bitmap": {
            "displayName": "1bit bitmap",
            "description": "2D array of pixel value (0s and 1s)",
        }
    },
    "outports": {
        "pixelArt": {
            "displayName": "Pixel Artwork",
            "description": "2D array of pixel values",
        }
    },
}


class PixelArt(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
        print("main loop")
