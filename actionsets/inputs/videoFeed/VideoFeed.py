from planager.Action import Action

CONFIG = {
    "displayName": "Video Feed",
    "inports": {
        "video": {"displayName": "video"},
    },
    "outports": {"video": {"displayName": "video"}, "image": {"displayName": "image"}},
}


class VideoFeed(Action, config=CONFIG):
    def takeSnapshot(self, snap):
        self.updateOutports({"image": snap})
