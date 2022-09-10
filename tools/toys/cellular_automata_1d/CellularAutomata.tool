{
    "displayName": "Cellular Automata",
    "inports": {
        "rule": {
            "displayName": "rule"
        },
        "startState": {
            "displayName": "start state"
        },
        "iterations": {
            "displayName": "iterations"
        },
        "border": {
            "displayName": "border"
        }
    },
    "outports": {
        "automata": {
            "displayName": "automata",
            "description": "2D array of pixel values"
        }
    },
    "state": {
        "automata": [],
        "rule": [1,0,0,1,0,1,1,0],
        "border": true,
        "iterations": 100,
        "startState": [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    }
}