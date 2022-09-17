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


def send_toolchain_info(info):
    sio.emit("toolchain_info", info)


@sio.on("new_toolchain")
def new_toolchain():
    session.pop("toolchain", None)
    new_toolchain = Toolchain(socket=sio)
    session["toolchain"] = new_toolchain
    return {}


@sio.on("get_toolchain")
def get_toolchain():
    """Gets the toolchain stored in the session.

    Checks to see if there is a toolchain in the session. If not, creates and
    returns a new toolchain.

    Returns:
        JSON: The JSON specification for the toolchain.
    """
    if "toolchain" in session:
        return session.get("toolchain").toJSON()
    return {}


@sio.on("get_toolchain_info")
def get_toolchain_info():
    """Gets the toolchain stored in the session.

    Checks to see if there is a toolchain in the session. If not, creates and
    returns a new toolchain.

    Returns:
        JSON: The JSON specification for the toolchain.
    """
    if "toolchain" in session:
        return session.get("toolchain").info()
    return {}


@sio.on("set_toolchain")
def set_toolchain(toolchain_config):
    """Creates a new Toolchain from a configuration file and adds it to the
    session.

    Returns:
        dict: toolchain JSON formatting
    """
    session.pop("toolchain", None)
    new_toolchain = Toolchain(
        tool_library=tool_library, src=toolchain_config, socket=sio
    )
    session["toolchain"] = new_toolchain

    return new_toolchain.toJSON()


@sio.on("clear_toolchain")
def clear_toolchain():
    """Removes the current toolchain from the session

    Returns:
        dict: Dictionary containing the result message.
    """
    session.pop("toolchain", None)

    new_toolchain = Toolchain()
    session["toolchain"] = new_toolchain
    session.modified = True

    return {"message": "OK"}


@sio.on("get_tool_library")
def get_tool_library():
    """Endpoint for retreiving the tool library.

    Returns:
        dict: A dictionary of categories of the tools in the tool library.
    """
    return tool_library.get_tools()


@sio.on("add_tool")
def add_tool(req):
    """Adds a tool to the current toolchain.

    Retrieves the current toolchain from the session and calls its add_tool()
    method, passing in the tool name from the request JSON.

    Returns:
        JSON: a json version of the tool that was created.
    """
    tool_class = tool_library.get_tool_class(req["category"], req["tool"])
    if not tool_class:
        error("Error! Could not find that tool!")
        return

    try:
        new_tool = session.get("toolchain").add_tool(tool_class)
    except BaseException as err:
        error(f"Error adding tool: Unexpected {err=}, {type(err)=}")
        raise

    send_toolchain_info(session.get("toolchain").info())

    return new_tool.toJSON()


@sio.on("remove_tool")
def remove_tool(tool_id):
    """Removes the specified tool from the toolchain.

    Removes the specified tool from the toolchain and returns the tool that was
    removed.
    """
    removed_tool = session.get("toolchain").remove_tool(tool_id)

    return removed_tool.toJSON()


@sio.on("add_pipe")
def add_pipe(pipe_info):
    """Adds a pipe between two tools in the current toolchain.

    Unpacks the request JSON containing a dictionary containing origin_tool_id,
    origin_port_id, destination_tool_id, and destination_port_id. These are
    passed to the toolchains's add_pipe method.

    Returns:
        dict: the data about the link that was created
    """
    session.get("toolchain").add_pipe(
        pipe_info["origin_tool_id"],
        pipe_info["origin_port_id"],
        pipe_info["destination_tool_id"],
        pipe_info["destination_port_id"],
    )

    message("PLUMBING: ", "Pipe hooked up.")
    return pipe_info


@sio.on("remove_pipe")
def remove_pipe():
    """Removes a pipe between two tools/ports in the toolchain"""
    pass


@sio.on("update_tool_coordinates")
def update_tool_coordinates(msg):
    session.get("toolchain").update_tool_coordinates(msg["tool_id"], msg["coordinates"])
    return {"msg": "ok"}


@sio.on("update_view_coordinates")
def update_view_coordinates(msg):
    # TODO: How can we separate out the client info (like view and tool coords) from the
    # toolchain info?
    session.get("toolchain").update_tool_coordinates(msg["tool_id"], msg["coordinates"])
    return {"msg": "ok"}


if __name__ == "__main__":
    sio.run(app, use_reloader=True, host="0.0.0.0", port=5000)
