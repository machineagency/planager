from flask import Blueprint

math_blueprint = Blueprint('math_blueprint', __name__)

@math_blueprint.get("/init")
def initAxi():
    print("init")
    return "math init"

@math_blueprint.get("/connect")
def connect():
    # current_app
    print("connect")
    return "math connect"