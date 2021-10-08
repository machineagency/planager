from flask import Blueprint

math_blueprint = Blueprint('math_blueprint', __name__)

@math_blueprint.get("/")
def initAxi():
    print("init")
    return "math init"

@math_blueprint.get("/connect")
def connect():
    print("connect")
    return "math connect"
