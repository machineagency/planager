from flask import session
from rich import print
from rich.traceback import install

from planager.Plan import Plan

from app import action_manager, sio

# from app import action_manager, app, sock

from app.logging import info, error, debug

# sio = sock
install()


@sio.on("newPlan")
def home():
    debug(session)
    session.pop("plan", None)
    newPlan = Plan(socket=sio)
    debug(newPlan)
    session["plan"] = newPlan
    debug("plan added to session")
    debug(session["plan"])
    return {}


@sio.on("getPlan")
def getPlan():
    """Gets the plan stored in the session.

    Checks to see if there is a plan in the session. If not, creates and
    returns a new plan.

    Returns:
        JSON: The JSON specification for the planager plan.
    """
    if "plan" in session:
        return session.get("plan").toJSON()
    return {}


@sio.on("uploadPlan")
def uploadPlan(planJSON):
    """Adds a plan to the session.

    Returns:
        dict: contains ok message
    """
    session.pop("plan", None)
    newPlan = Plan(action_manager=action_manager, src=planJSON, socket=sio)
    session["plan"] = newPlan

    return newPlan.toJSON()


@sio.on("clearPlan")
def clearPlan():
    """Removes the plan from the session

    Returns:
        dict: Dictionary containing the result message.
    """
    session.pop("plan", None)

    newPlan = Plan()
    session["plan"] = newPlan
    session.modified = True

    return {"message": "OK"}


@sio.on("getAvailableActions")
def getAvailableActions():
    """Endpoint for retreiving the available actions.

    Returns:
        list: A list of the available actions.
    """
    dropdown, flattened = action_manager.get_available_actions()
    return {"actions": flattened, "dropdown": dropdown}


@sio.on("addAction")
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


@sio.on("addPipe")
def addPipe(connection):
    """Adds a link between two actions in the current plan.

    Unpacks the request JSON containing a dictionary containing startActionID,
    startPortID, endActionID, and endPortID. These are passed to the plan's
    addPipe method.

    Returns:
        linkdata: the data about the link that was created
    """
    session.get("plan").addPipe(
        connection["startActionID"],
        connection["startPortID"],
        connection["endActionID"],
        connection["endPortID"],
    )
    info("Plumbing: ", "Pipe hooked up.")

    return {"pipe": connection}


@sio.on("removeAction")
def removeAction(request):
    """Removes the specified action from the plan.

    Removes the specified action from the plan and returns the action that was removed.
    """
    removed_action = session.get("plan").removeAction(request["actionID"])
    return removed_action.toJSON()


@sio.on("removeLink")
def removeLink(link):
    startactionJSON, endActionJSON = session.get("plan").removeLink(
        link["startActionID"],
        link["startPortID"],
        link["endActionID"],
        link["endPortID"],
    )
    return {"startActionJSON": startactionJSON, "endActionJSON": endActionJSON}


@sio.on("moveTool")
def moveTool(info):
    session.get("plan").updateActionCoords(info["id"], info["coords"])
    return {"msg": "ok"}
