from flask import Flask, session
from flask_session import Session
from flask_socketio import SocketIO

from rich import print
from rich.traceback import install

from planager.ToolLibrary import ToolLibrary
from planager.Toolchain import Toolchain
from planager.logging import message, error, debug

install()

app = Flask(__name__)


TOOL_LIBRARY_PATH = "tools"

tool_library = ToolLibrary(tool_library_path=TOOL_LIBRARY_PATH)
tool_library.build_index()

# NOTE: The secret key is used to cryptographically sign the cookies used for
# storing the session identifier.
app.config["SECRET_KEY"] = "top-secret!"
app.config["SESSION_TYPE"] = "filesystem"

# Create and initialize the Flask-Session object.
# Flask-Session is a flask extension that adds support for server-side
# sessions, rather than Flask's default client-side sessions. Don't ever access
# the Session object directly; just use the built in Flask session interface.
Session(app)

sio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")


@sio.on("newPlan")
def new_toolchain():
    session.pop("plan", None)
    new_toolchain = Toolchain(socket=sio)
    session["plan"] = new_toolchain
    return {}


@sio.on("getPlan")
def get_toolchain():
    """Gets the toolchain stored in the session.

    Checks to see if there is a toolchain in the session. If not, creates and
    returns a new toolchain.

    Returns:
        JSON: The JSON specification for the planager toolchain.
    """
    if "plan" in session:
        return session.get("plan").toJSON()
    return {}


@sio.on("uploadPlan")
def upload_toolchain(toolchain_config):
    """Creates a new Toolchain from a configuration file and adds it to the
    session.

    Returns:
        dict: toolchain JSON formatting
    """
    session.pop("plan", None)
    new_toolchain = Toolchain(
        tool_library=tool_library, src=toolchain_config, socket=sio
    )
    session["plan"] = new_toolchain

    return new_toolchain.toJSON()


@sio.on("clearPlan")
def clear_toolchain():
    """Removes the current toolchain from the session

    Returns:
        dict: Dictionary containing the result message.
    """
    session.pop("plan", None)

    new_toolchain = Toolchain()
    session["plan"] = new_toolchain
    session.modified = True

    return {"message": "OK"}


@sio.on("getToolLibrary")
def get_tool_library():
    """Endpoint for retreiving the tool library.

    Returns:
        dict: A dictionary of categories of the tools in the tool library.
    """
    # hierarchy, flattened = tool_library.get_tools()
    return tool_library.get_tools()


@sio.on("addToolToToolchain")
def add_tool_to_toolchain(req):
    """Adds a tool to the current toolchain.

    Retrieves the current toolchain from the session and calls its add_tool()
    method, passing in the tool name from the request JSON.

    Returns:
        JSON: a jsonpickle-encoded version of the action that was created.
    """
    tool_class = tool_library.get_tool_class(req["category"], req["tool"])
    if not tool_class:
        error("Error! Could not find that tool!")
        return

    try:
        new_tool = session.get("plan").add_tool(tool_class)
    except BaseException as err:
        error(f"Error adding tool: Unexpected {err=}, {type(err)=}")
        raise

    return new_tool.toJSON()


@sio.on("addPipe")
def add_pipe(pipe_info):
    """Adds a pipe between two tools in the current toolchain.

    Unpacks the request JSON containing a dictionary containing startActionID,
    startPortID, endActionID, and endPortID. These are passed to the
    toolchains's addPipe method.

    Returns:
        linkdata: the data about the link that was created
    """
    session.get("plan").add_pipe(
        pipe_info["startActionID"],
        pipe_info["startPortID"],
        pipe_info["endActionID"],
        pipe_info["endPortID"],
    )

    message("PLUMBING: ", "Pipe hooked up.")
    return {"pipe": pipe_info}


@sio.on("remove_tool")
def remove_tool(tool_id):
    """Removes the specified tool from the toolchain.

    Removes the specified tool from the toolchain and returns the tool that was
    removed.
    """
    removed_tool = session.get("plan").remove_tool(tool_id)

    return removed_tool.toJSON()


@sio.on("remove_pipe")
def remove_pipe():
    """Removes a pipe between two tools/ports in the toolchain"""
    pass


@sio.on("moveTool")
def move_tool(info):
    session.get("plan").updateActionCoords(info["id"], info["coords"])
    return {"msg": "ok"}


if __name__ == "__main__":
    sio.run(app, use_reloader=True, host="0.0.0.0", port=5000)
