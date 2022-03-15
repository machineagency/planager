import jsonpickle

from flask import request, render_template, session
from rich import print
from rich.traceback import install

from app.planager.workflow.Plan import Plan
from app import app, action_manager, socketio


install()


def update_handler(actionJSON):
    socketio.emit("updateActionJSON", actionJSON)


def data_handler(linkInfo):
    socketio.emit("animateLinkDataflow", linkInfo)


def ports_handler(actionJSON):
    socketio.emit("portsUpdated", actionJSON)


@app.get("/")
def home():
    """Index route for the planager.

    Returns:
        [template]: index.html template
    """
    session.pop("plan", None)
    newPlan = Plan(
        update_handler=update_handler,
        data_handler=data_handler,
        ports_handler=ports_handler,
    )
    session["plan"] = newPlan
    return render_template("index.html")


@socketio.on("savePlan")
def savePlan():
    """Gets the plan stored in the session.

    Checks to see if there is a plan in the session. If not, creates and
    returns a new plan.

    Returns:
        JSON: The JSON specification for the planager plan.
    """
    if "plan" in session:
        return session.get("plan").toJSON()
    return {}


@socketio.on("uploadPlan")
def uploadPlan(planJSON):
    """Adds a plan to the session.

    Returns:
        dict: contains ok message
    """
    session.pop("plan", None)
    newPlan = Plan(
        update_handler=update_handler,
        data_handler=data_handler,
        ports_handler=ports_handler,
        action_manager=action_manager,
        src=planJSON,
    )
    session["plan"] = newPlan

    return newPlan.toJSON()


@socketio.on("clearPlan")
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


@socketio.on("getAvailableActions")
def getAvailableActions():
    """Endpoint for retreiving the available actions.

    Returns:
        list: A list of the available actions.
    """
    dropdown, flattened = action_manager.get_available_actions()
    return {"actions": flattened, "dropdown": dropdown}


@socketio.on("addAction")
def addAction(req):
    """Adds an action to the current plan.

    Retrieves the current plan from the session and calls its addAction()
    method, passing in the action name from the request JSON.

    Returns:
        JSON: a jsonpickle-encoded version of the action that was created.
    """
    action_class = action_manager.get_action_class(req["actionSet"], req["action"])
    if not action_class:
        print("Error! Could not find that action!")
        return

    try:
        new_action = session.get("plan").addAction(action_class)
    except BaseException as err:
        print(f"Error adding action to plan: Unexpected {err=}, {type(err)=}")
        raise

    return new_action.toJSON()


@socketio.on("addLink")
def addLink(connection):
    """Adds a link between two actions in the current plan.

    Unpacks the request JSON containing a dictionary containing startActionID,
    startPortID, endActionID, and endPortID. These are passed to the plan's
    addLink method.

    Returns:
        linkdata: the data about the link that was created
    """
    session.get("plan").addLink(
        connection["startActionID"],
        connection["startPortID"],
        connection["endActionID"],
        connection["endPortID"],
    )

    return {"linkData": connection}


@socketio.on("removeAction")
def removeAction(request):
    """Removes the specified action from the plan.

    Removes the specified action from the plan and returns the action that was removed.
    """
    removed_action = session.get("plan").removeAction(request["actionID"])
    return removed_action.toJSON()


@socketio.on("removeLink")
def removeLink(link):
    startactionJSON, endActionJSON = session.get("plan").removeLink(
        link["startActionID"],
        link["startPortID"],
        link["endActionID"],
        link["endPortID"],
    )
    return {"startActionJSON": startactionJSON, "endActionJSON": endActionJSON}


@socketio.on("actionMoved")
def removeLink(info):
    session.get("plan").updateActionCoords(info["actionID"], info["coords"])
    return {"msg": "ok"}


@socketio.on("sendDataToOutport")
def sendDataToOutport(data):
    """Sends data created in the frontend to an action outport

    Returns:
        dict: A dictionary containing the JSON representation of the plan
    """
    actionJSON = session.get("plan").sendDataToOutport(
        data["actionID"], data["dataDict"]
    )

    return {"actionJSON": actionJSON}


@socketio.on("runBackendMethod")
def runBackendMethod(data):
    """Runs a method in the backend for an action.

    Raises:
        NotImplementedError: If the method does not exist, raises NotImplementedError

    Returns:
        dict: dict containing response from the method
    """
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

    return {"data": res}
