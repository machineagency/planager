import jsonpickle

from flask import request, render_template, session
from rich import print
from rich.traceback import install

from app.planager.workflow.Plan import Plan
from app import app, action_manager, socketio


install()


def update_handler(actionJSON):
    socketio.emit("update", actionJSON)


@app.get("/")
def home():
    """Index route for the planager.

    Returns:
        [template]: index.html template
    """
    session.pop("plan", None)
    newPlan = Plan(update_handler=update_handler)
    session["plan"] = newPlan
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
        return session.get("plan").toJSON()
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
    session.pop("plan", None)

    newPlan = Plan(update_handler=update_handler)
    session["plan"] = newPlan
    session.modified = True

    return {"message": "OK"}


@app.get("/getActions")
def getActions():
    """Endpoint for retreiving the available actions.

    Returns:
        list: A list of the available actions.
    """
    dropdown, flattened = action_manager.get_available_actions()
    return jsonpickle.encode({"actions": flattened, "dropdown": dropdown})


@app.post("/addAction")
def addAction():
    """Adds an action to the current plan.

    Retrieves the current plan from the session and calls its addAction()
    method, passing in the action name from the request JSON.

    Returns:
        JSON: a jsonpickle-encoded version of the action that was created.
    """
    req = request.get_json()

    action_class = action_manager.get_action_class(req["actionSet"], req["action"])
    if not action_class:
        print("Error! Could not find that action!")
        return

    try:
        new_action = session.get("plan").addAction(action_class)
    except:
        print("Error adding action to plan")
        return

    return new_action.toJSON()


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
    startActionJSON, endActionJSON = session.get("plan").addLink(
        connection["startActionID"],
        connection["startPortID"],
        connection["endActionID"],
        connection["endPortID"],
    )

    return {
        "linkData": connection,
        "startAction": startActionJSON,
        "endAction": endActionJSON,
    }


@app.post("/removeAction")
def removeAction():
    """Removes the specified action from the plan.

    Removes the specified action from the plan and returns the updated plan
    """
    removed_action = session.get("plan").removeAction(request.get_json()["actionID"])
    return removed_action.toJSON()


@socketio.on("removeLink")
def removeLink(link):
    session.get("plan").removeLink(
        link["startActionID"],
        link["startPortID"],
        link["endActionID"],
        link["endPortID"],
    )
    print(session.get("plan"))


@app.post("/sendDataToOutport")
def sendDataToOutport():
    """Sends data created in the frontend to an action outport

    Returns:
        dict: A dictionary containing the JSON representation of the plan
    """
    data = jsonpickle.decode(request.get_data())

    session.get("plan").sendDataToOutport(data["actionID"], data["dataDict"])

    # TODO: Change this to a socket connection and respond here that the data was received
    return {"res": "ok"}


@app.post("/runBackendMethod")
def runBackendMethod():
    """Runs a method in the backend for an action.

    Raises:
        NotImplementedError: If the method does not exist, raises NotImplementedError

    Returns:
        dict: dict containing response from the method
    """
    data = jsonpickle.decode(request.get_data())

    method = None
    try:
        method = getattr(session.get("plan").actions[data["actionID"]], data["method"])
    except AttributeError:
        raise NotImplementedError(
            "Class `{}` does not implement `{}`".format(
                session.get("plan").actions[data["actionID"]].__class__.__name__,
                data["method"],
            )
        )

    res = method(data["args"])

    return jsonpickle.encode({"data": res})
