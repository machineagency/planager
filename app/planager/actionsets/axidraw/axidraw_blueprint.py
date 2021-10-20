from flask import Blueprint


axidraw_blueprint = Blueprint("axidraw_blueprint", __name__)


@axidraw_blueprint.get("/")
def initAxi():
    return "Init func axidraw"


@axidraw_blueprint.get("/connect")
def connect():
    return "connect func axidraw"
