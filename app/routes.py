from flask import request, render_template, session

from . import app


@app.get("/")
def home():
    # if 'plan' in session:
    #     return session["plan"]
    return render_template("index.html")


@app.get("/input")
def handleInput():
    """Endpoint for handling input to the frontend."""
    print("input")
    return


@app.post("/updateCoords")
def updateCoords():
    print(request.get_json())
    return {"message": "success"}


@app.post("/uploadPlan")
def uploadPlan():
    # session["plan"] = request.get_json()
    return "OK"


@app.get("/clearPlan")
def clearPlan():
    # session["plan"] = None
    return


@app.get("/actions")
def actions():
    # Should return a dictionary of packages with their included actions
    return {}
