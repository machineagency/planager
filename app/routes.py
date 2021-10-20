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
        return session["plan"]
    return {}


@app.post("/updateCoords")
def updateCoords():
    """
    Updates the xy coordinates of an action on the Planager canvas.

    Returns:
        dictionary: a dictionary containing a message
    """
    # print(request.get_json())
    return {"message": "success"}


@app.post("/uploadPlan")
def uploadPlan():
    """
    Adds a plan to the session.

    Returns:
        Dict: contains ok message
    """
    session["plan"] = request.get_json()
    return {"message": "OK"}


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
    new_action = session["plan"].addAction(action_Dict[action])

    return session["plan"].toJSON()


@app.post("/addLink")
def addLink():
    link = request.get_json()
    # Generate a unique ID for the link
    # Connects action one to action two
    # Properly add it to the plan datastructure
    # Update the two actions it connects

    raise NotImplementedError


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
    action = jsonpickle.decode(request.get_data())
    res = jsonpickle.encode(action.main())
    return({"result": res})