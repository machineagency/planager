from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Raster to SVG",
    "inports": {
        "raster": {
            "displayName": "Raster Image",
            "description": "The raster image to convert to SVG.",
        }
    },
    "outports": {"svg": {"displayName": "SVG", "description": "The converted SVG"}},
}


class ImageTrace(Action):
    def __init__(self):
        Action.__init__(self, CONFIG)

    def main(self):
        print("Image trace main loop")
