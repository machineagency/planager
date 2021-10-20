from flask import Blueprint

# import Axidraw

axidraw_blueprint = Blueprint("axidraw_blueprint", __name__)


@axidraw_blueprint.get("/")
def initAxi():
    # axi = Axidraw()
    return "Init func axi"


@axidraw_blueprint.get("/connect")
def connect():
    return "connect func axi"
