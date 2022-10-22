from flask import Flask

import socketio

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

ASYNC_MODE = "eventlet"
ORIGINS = "*"
ENGINEIO_LOGGER = False
LOGGER = False
BUFFER = 10000000

static_files = {"/": "./dist/"}  # Static files are served from the dist folder

sio = socketio.Server(
    cors_allowed_origins=ORIGINS,
    async_mode=ASYNC_MODE,
    logger=LOGGER,
    engineio_logger=ENGINEIO_LOGGER,
    max_http_buffer_size=BUFFER,
)

app.wsgi_app = socketio.WSGIApp(sio, app.wsgi_app, static_files=static_files)


def send_toolchain_info(info):
    sio.emit("toolchain_info", info)


@sio.event
def connect(sid, environ, auth):
    message("Connected to ", sid)


@sio.event
def disconnect(sid):
    message("Disconnected from ", sid)


@sio.on("*")
def handle_message(event, sid, data):
    debug("Socket " + sid + " received unhandled event type: " + event)
    message("Message: ", data)


@sio.event
def new_toolchain(sid):
    debug("Creating a new toolchain!")

    new_toolchain = Toolchain(socket=sio)

    sio.save_session(sid, {"toolchain": new_toolchain})


@sio.event
def get_toolchain(sid):
    """Gets the toolchain stored in the session.

    Checks to see if there is a toolchain in the session. If not, creates and
    returns a new toolchain.

    Returns:
        JSON: The JSON specification for the toolchain.
    """
    with sio.session(sid) as session:
        if "toolchain" in session:
            return session.get("toolchain").toJSON()
    return {}


@sio.event
def get_toolchain_info(sid):
    """Gets the toolchain stored in the session.

    Checks to see if there is a toolchain in the session. If not, creates and
    returns a new toolchain.

    Returns:
        JSON: The JSON specification for the toolchain.
    """
    with sio.session(sid) as session:
        if "toolchain" in session:
            return session.get("toolchain").info()
    return {}


@sio.event
def set_toolchain(sid, toolchain_config):
    """Creates a new Toolchain from a configuration file and adds it to the
    session.

    Returns:
        dict: toolchain JSON formatting
    """
    with sio.session(sid) as session:

        new_toolchain = Toolchain(
            tool_library=tool_library, src=toolchain_config, socket=sio
        )
        session["toolchain"] = new_toolchain

        return new_toolchain.toJSON()


@sio.event
def clear_toolchain(sid):
    """Removes the current toolchain from the session

    Returns:
        dict: Dictionary containing the result message.
    """
    session.pop("toolchain", None)

    new_toolchain = Toolchain()
    session["toolchain"] = new_toolchain
    session.modified = True

    return {"message": "OK"}


@sio.event
def get_tool_library(sid):
    """Endpoint for retreiving the tool library.

    Returns:
        dict: A dictionary of categories of the tools in the tool library.
    """
    return tool_library.get_tools()


@sio.event
def add_tool(sid, req):
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

    session = sio.get_session(sid)

    try:
        new_tool = session.get("toolchain").add_tool(tool_class)
    except BaseException as err:
        error(f"Error adding tool: Unexpected {err=}, {type(err)=}")
        raise

    send_toolchain_info(session.get("toolchain").info())

    return new_tool.toJSON()


@sio.event
def remove_tool(sid, tool_id):
    """Removes the specified tool from the toolchain.

    Removes the specified tool from the toolchain and returns the tool that was
    removed.
    """
    with sio.session(sid) as session:
        removed_tool = session.get("toolchain").remove_tool(tool_id)

        return removed_tool.toJSON()


@sio.event
def add_pipe(sid, pipe_info):
    """Adds a pipe between two tools in the current toolchain.

    Unpacks the request JSON containing a dictionary containing origin_tool_id,
    origin_port_id, destination_tool_id, and destination_port_id. These are
    passed to the toolchains's add_pipe method.

    Returns:
        dict: the data about the link that was created
    """
    with sio.session(sid) as session:
        session.get("toolchain").add_pipe(
            pipe_info["origin_tool_id"],
            pipe_info["origin_port_id"],
            pipe_info["destination_tool_id"],
            pipe_info["destination_port_id"],
        )

    message("PLUMBING: ", "Pipe hooked up.")
    return pipe_info


@sio.event
def remove_pipe(sid):
    """Removes a pipe between two tools/ports in the toolchain"""
    pass


@sio.event
def update_tool_coordinates(sid, msg):
    with sio.session(sid) as session:
        session.get("toolchain").update_tool_coordinates(
            msg["tool_id"], msg["coordinates"]
        )
    return {"msg": "ok"}


@sio.event
def update_view_coordinates(sid, msg):
    # TODO: How can we separate out the client info (like view and tool coords) from the
    # toolchain info?
    with sio.session(sid) as session:
        session.get("toolchain").update_tool_coordinates(
            msg["tool_id"], msg["coordinates"]
        )
    return {"msg": "ok"}


if __name__ == "__main__":
    import eventlet

    eventlet.wsgi.server(eventlet.listen(("", 5000)), app)
