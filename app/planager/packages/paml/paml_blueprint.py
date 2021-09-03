from flask import Blueprint

paml_blueprint = Blueprint("paml_blueprint", __name__)


@paml_blueprint.get("/")
def init():
    return "paml init"
