from planager.Action import Action

CONFIG = {
    "displayName": "Image Viewer",
    "inports": {"imIn": {"displayName": "Image in"}},
    "outports": {"imOut": {"displayName": "Image out"}},
}


class ImageViewer(Action, config=CONFIG):
    pass
