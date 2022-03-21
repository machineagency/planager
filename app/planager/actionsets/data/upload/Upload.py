from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Upload",
    "inports": {},
    "outports": {
        "fileContents": {
            "displayName": "File Contents",
            "description": "the  file",
        },
        "fileName": {
            "displayName": "File Name",
            "description": "  file",
        },
        "fileSize": {
            "displayName": "File Size",
            "description": "  file",
        },
        "fileType": {
            "displayName": "File Type",
            "description": "  file",
        },
        "lastModified": {
            "displayName": "Last Modified",
            "description": "  file",
        },
    },
    "settings": {
        "specificFileTypes": {"type": "boolean", "default": False},
        "allowedTypes": {"type": "array", "default": []},
        "readerMode": {
            "type": "oneOf",
            "default": "text",
            "choices": ["text", "dataurl", "binary"],
        },
    },
}


class Upload(Action, config=CONFIG):
    def main(self):
        """The main loop; this is what runs when the action is run."""
