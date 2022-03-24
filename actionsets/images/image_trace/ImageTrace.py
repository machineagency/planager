from planager.Action import Action

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


class ImageTrace(Action, config=CONFIG):
    def main(self):
        print("Image trace main loop")
