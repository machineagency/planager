import jsonpickle
from .planager.workflow.Plan import Plan
from . import app, action_Dict, socketio, emit
from flask import request, render_template, session
from rich import print, print_json
from rich.traceback import install
install()



@socketio.event
def my_event(message):
    emit('my response', {'data': 'got it!'})

@socketio.on("createAction")
def createAction(message):
    print("CRESUILHSDJKLGFHKLSJDFHKLSDFHJ")
    print(message)
    emit("connection", "HELLOO FROM THE BACKEND")

@socketio.on('connection')
def test_connect():
    emit('my response', {'data': 'Connected'})

@app.get("/")
def home():
    """Index route for the planager.

    Returns:
        [template]: index.html template
    """
    session.pop('plan', None)
    newPlan = Plan()
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
        return session.get('plan').toJSON()
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

    newPlan = Plan()
    session["plan"] = newPlan
    session.modified = True

    return {"message": "OK"}


@app.get("/getActions")
def getActions():
    """Endpoint for retreiving the available actions.

    Returns:
        list: A list of the available actions.
    """

    dropdown = {}
    flattened = {}

    for actionSet in action_Dict.keys():
        dropdown[actionSet] = [a for a in action_Dict[actionSet].keys()]
        for action in action_Dict[actionSet].keys():
            flattened[action] = {"component": None, "actionSet": actionSet}

    return jsonpickle.encode({"dropdown": dropdown, "actions": flattened})


@app.post("/addAction")
def addAction():
    """Adds an action to the current plan.

    Retreives the current plan from the session and calls its addAction()
    method, passing in the action name from the request JSON.

    Returns:
        JSON: a jsonpickle-encoded version of the plan.
    """
    req = request.get_json()
    new_action = session.get('plan').addAction(action_Dict[req['actionSet']][req['action']])
    # print_json(data=session.get('plan').toJSON())
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
    print_json(data=connection)
    session.get('plan').addLink(
        connection["startActionID"],
        connection["startPortID"],
        connection["endActionID"],
        connection["endPortID"],
    )

    return connection


@app.post("/removeAction")
def removeAction():
    """Removes the specified action from the plan.

    Removes the specified action from the plan and returns the updated plan
    """
    session.get('plan').removeAction(request.get_json()['actionID'])
    return session.get('plan').toJSON()


@app.post("/removeLink")
def removeLink():
    linkID = request.get_json()
    raise NotImplementedError


@app.post("/sendDataToOutport")
def sendDataToOutport():
    """Sends data created in the frontend to an action outport

    Returns:
        dict: A dictionary containing the JSON representation of the plan
    """
    data = jsonpickle.decode(request.get_data())

    session['plan'].actions[data['actionID']].updateOutports(data['dataDict'])

    return session["plan"].toJSON()


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
        method = getattr(
            session['plan'].actions[data['actionID']], data['method'])
    except AttributeError:
        raise NotImplementedError("Class `{}` does not implement `{}`".format(
            session['plan'].actions[data['actionID']].__class__.__name__, data['method']))

    res = method(data['args'])

    return jsonpickle.encode({"data": res})
