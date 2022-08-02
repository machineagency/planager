from flask import Flask, render_template, request, session, jsonify

from flask_session import Session
from flask_socketio import SocketIO

# from flask_sock import Sock

from app.action_manager import ActionManager
from app.logging import info, error, debug

import redis, os

app = Flask(
    __name__,
    static_url_path="",
    static_folder="../build",
    template_folder="../build",
)


PACKAGE_DIR = "actionsets"

action_manager = ActionManager(action_set_path=PACKAGE_DIR)
action_manager.build_action_dict()

# NOTE: The secret key is used to cryptographically sign the cookies used for storing
#       the session identifier.
app.config["SECRET_KEY"] = "top-secret!"
# redis_url = os.getenv("REDIS_URL", "redis://127.0.0.1:6379")

# Configure Redis for storing the session data on the server-side
# app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_TYPE"] = "filesystem"

# app.config["SESSION_PERMANENT"] = False
# app.config["SESSION_USE_SIGNER"] = True
# app.config["SESSION_REDIS"] = redis.Redis(host="127.0.0.1", port=6379, db=0)

# Create and initialize the Flask-Session object.
# NOTE: Flask-Session is a flask extension that adds support for server-side sessions, rather than Flask's
# default client-side sessions. Don't ever access the Session object
# directly; just use the built in Flask session interface.
# app.config["SESSION_COOKIE_SECURE"] = True

Session(app)
# sock = Sock(app)

# sio is the socket instance
sio = SocketIO(
    app,
    logger=True,
    # cookie="planager",
    # manage_session=False,
    # engineio_logger=True,
    async_mode="eventlet",
    # cors_allowed_origins="http://localhost:8000",
    cors_allowed_origins="*",
)


# @app.route("/")
# def index():
#     return render_template("index.html")


# @sock.route("/planager")
# def echo(ws):
#     while True:
#         data = ws.receive()
#         print(data)
#         ws.send("here's a response :)")


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return app.send_static_file("index.html")


# @app.route("/session", methods=["GET", "POST"])
# def session_access():
#     if request.method == "GET":
#         return jsonify({"session": session.get("value", "")})
#     data = request.get_json()
#     if "session" in data:
#         session["value"] = data["session"]

#     return "", 204


# @sio.on("/api/test")
# def test():
#     return "hello"


# @sio.on("connect")
# def connected():
#     debug("Connected to client")


# @sio.on("message")
# def handle_message(data):
#     print("received message: " + data)
