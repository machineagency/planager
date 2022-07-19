{
    "displayName": "Command Queue",
    "inports": {
        "lock": {
            "displayName": "lock"
        },
        "batch": {
            "displayName": "batch"
        },
        "append": {
            "displayName": "append"
        },
        "signal": {
            "displayName": "signal"
        }
    },
    "outports": {
        "send": {
            "displayName": "send"
        },
        "all": {
            "displayName": "all"
        },
        "selected": {
            "displayName": "selected"
        },
        "next": {
            "displayName": "next"
        }
    },
    "state": {
        "command_queue": [],
        "locked": false
    }
}