from flask import request, render_template, session

from . import app


@app.get("/")
def home():
    """
    Index route for the planager.

    Returns:
        [template]: index.html template
    """
    return render_template("index.html")


@app.get("/input")
def handleInput():
    """
    Handles input to the planager.
    """
    print("input")
    return


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
    print(request.get_json())
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
    session["plan"] = None
    return


@app.get("/actions")
def actions():
    """
    Endpoint for retreiving the available actions.

    Returns:
        [dict]: A dictionary containing the available actions.
    """
    return {}
