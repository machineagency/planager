from flask import request, render_template, session

from . import app, action_Dict

from .planager.workflow.Plan import Plan
from .planager.workflow.Action import Action

import jsonpickle


@app.get("/")
def home():
    """
    Index route for the planager.

    Returns:
        [template]: index.html template
    """
    return render_template("index.html")


@app.get("/handleInput")
def handleInput():
    """
    Handles user input to the planager.
    """
    # TODO: Handle user input to actions
    raise NotImplementedError


@app.get("/getplan")
def loadPlan():
    """
    Checks to see if there is a plan in the session. If not, creates and returns a new plan.

    Returns:
        JSON: The JSON specification for the planager plan.
    """
    if "plan" in session:
        return jsonpickle.encode(session["plan"])
    return {}


@app.post("/updateCoords")
def updateCoords():
    """
    Updates the xy coordinates of an action on the Planager canvas.

    Returns:
        dictionary: a dictionary containing a message
    """
    raise NotImplementedError


@app.post("/uploadPlan")
def uploadPlan():
    """
    Adds a plan to the session.

    Returns:
        Dict: contains ok message
    """
    raise NotImplementedError


@app.get("/clearPlan")
def clearPlan():
    """
    Removes the plan from the current session.
    """

    newPlan = Plan()

    session["plan"] = newPlan
    return {"message": "OK"}


@app.get("/getActions")
def getActions():
    """
    Endpoint for retreiving the available actions.

    Returns:
        [list]: A list of the available actions.
    """
    actionArray = list(action_Dict.keys())
    return {"actions": actionArray}


@app.post("/addAction")
def addAction():
    action = request.get_json()
    session["plan"].addAction(action_Dict[action])

    return jsonpickle.encode(session["plan"])


@app.post("/addLink")
def addLink():
    connection = jsonpickle.decode(request.get_data())
    session["plan"].addLink(
        connection["startActionID"],
        connection["startPortID"],
        connection["endActionID"],
        connection["endPortID"],
    )

    return jsonpickle.encode(session["plan"])


@app.post("/removeAction")
def removeAction():
    actionID = request.get_json()
    raise NotImplementedError


@app.post("/removeLink")
def removeLink():
    linkID = request.get_json()
    raise NotImplementedError


@app.post("/run")
def run():
    actionID = jsonpickle.decode(request.get_data())

    for action in session["plan"].actions:
        if action.getID() == actionID:
            action.main()

    return {"result": "success"}
