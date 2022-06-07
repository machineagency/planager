from flask import Flask, render_template
from flask_session import Session
from flask_socketio import SocketIO

from app.action_manager import ActionManager
from app.logging import info, error, debug

import redis, os

app = Flask(
    __name__,
    static_url_path="",
    static_folder="../src/dist",
    template_folder="../src/dist",
)
sio = SocketIO(
    app, async_mode="gevent"
)  # cors_allowed_origins="http://localhost:5000")
# app, async_mode="gevent", cors_allowed_origins="*"
# )  # "http://localhost:8000")

PACKAGE_DIR = "actionsets"

action_manager = ActionManager(action_set_path=PACKAGE_DIR)
action_manager.build_action_dict()

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


@app.route("/")
def index():
    return "flask is running!"


@sio.on("/api/test")
def test():
    return "hello"


@sio.on("connect")
def connected():
    debug("Connected to client")
