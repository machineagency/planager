from flask import request, render_template, session

from . import app, action_Dict

from .planager.workflow.Plan import Plan

import jsonpickle


@app.get("/")
def home():
    """Index route for the planager.

    Returns:
        [template]: index.html template
    """
    return render_template("index.html")


@app.get("/handleInput")
def handleInput():
    """Handles user input to the planager.

    Not implemented

    Raises:
        NotImplementedError: Not currently implemented
    """
    # TODO: Handle user input to actions
    raise NotImplementedError


@app.get("/getplan")
def loadPlan():
    """Gets the plan stored in the session.

    Checks to see if there is a plan in the session. If not, creates and
    returns a new plan.

    Returns:
        JSON: The JSON specification for the planager plan.
    """
    if "plan" in session:
        return jsonpickle.encode(session["plan"])
    return {}


@app.post("/updateCoords")
def updateCoords():
    """Updates the xy coordinates of an action on the Planager canvas.

    Returns:
        dictionary: a dictionary containing a message
    """
    raise NotImplementedError


@app.post("/uploadPlan")
def uploadPlan():
    """Adds a plan to the session.

    Returns:
        dict: contains ok message
    """
    raise NotImplementedError


@app.get("/clearPlan")
def clearPlan():
    """Removes the plan from the session

    Returns:
        dict: Dictionary containing the result message.
    """

    newPlan = Plan()

    session["plan"] = newPlan
    return {"message": "OK"}


@app.get("/getActions")
def getActions():
    """Endpoint for retreiving the available actions.

    Returns:
        list: A list of the available actions.
    """
    actionArray = list(action_Dict.keys())
    return {"actions": actionArray}


@app.post("/addAction")
def addAction():
    """Adds an action to the current plan.

    Retreives the current plan from the session and calls its addAction()
    method, passing in the action name from the request JSON.

    Returns:
        JSON: a jsonpickle-encoded version of the plan.
    """
    action = request.get_json()
    session["plan"].addAction(action_Dict[action])

    return jsonpickle.encode(session["plan"])


@app.post("/addLink")
def addLink():
    """Adds a link between two actions in the current plan.

    Unpacks the request JSON containing a dictionary containing startActionID,
    startPortID, endActionID, and endPortID. These are passed to the plan's
    addLink method.

    Returns:
        dict: A JSON-compatible dictionary containing plan information encoded
        by jsonpickle.
    """
    connection = jsonpickle.decode(request.get_data())
    session["plan"].addLink(
        connection["startActionID"],
        connection["startPortID"],
        connection["endActionID"],
        connection["endPortID"],
    )

    # print(session["plan"])

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

    res = ""

    for action in session["plan"].actions:
        if action.getID() == actionID:
            res = action.main()

    return {"result": res}
