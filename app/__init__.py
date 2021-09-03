import redis

from flask import Flask
from flask_session import Session

from .planager.packages.axidraw.axidraw_blueprint import axidraw_blueprint
from .planager.packages.math.math_blueprint import math_blueprint
from .planager.packages.paml.paml_blueprint import paml_blueprint

app = Flask(__name__, template_folder="static")

# Register the blueprints for different actions
# The url prefix allows for easier management of routes and prevents
# routes from different actionsets from overriding eachother
app.register_blueprint(axidraw_blueprint, url_prefix="/axidraw")
app.register_blueprint(math_blueprint, url_prefix="/math")
app.register_blueprint(paml_blueprint, url_prefix="/paml")


# NOTE: The secret key is used to cryptographically-sign the cookies used for storing
#       the session identifier.
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

# Configure Redis for storing the session data on the server-side
# app.config["SESSION_TYPE"] = "redis"
# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_USE_SIGNER"] = True
# app.config["SESSION_REDIS"] = redis.from_url("redis://localhost:6379")

# Create and initialize the Flask-Session object. Allows for server-side sessions, rather than Flask's default client-side sessions
# server_session = Session(app)
