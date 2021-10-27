import redis
import os

from flask import Flask
from flask_session import Session

from .planager.actionsets.axidraw.axidraw_blueprint import axidraw_blueprint
from . import actionLoader


app = Flask(__name__, template_folder="static")

# Register the blueprints for different actions
# The url prefix allows for easier management of routes and prevents
# routes from different actionsets from overriding eachother
# TODO: blueprint registration should be dynamic
app.register_blueprint(axidraw_blueprint, url_prefix="/axidraw")

action_Dict = actionLoader.buildActionDict()

# NOTE: The secret key is used to cryptographically sign the cookies used for storing
#       the session identifier.
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
redis_url = os.getenv("REDISTOGO_URL", "redis://localhost:6379")

# Configure Redis for storing the session data on the server-side
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_REDIS"] = redis.from_url(redis_url)

# Create and initialize the Flask-Session object.
# NOTE: Flask-Session is a flask extension that adds support for server-side sessions, rather than Flask's
# default client-side sessions. Don't ever access the Session object
# directly; just use the built in Flask session interface.
app.config["SESSION_COOKIE_SECURE"] = True
server_session = Session(app)
