from flask import session
from rich import print
from rich.traceback import install

from planager.Toolchain import Toolchain

from app import tool_library, sio

# from app import tool_library, app, sock

from app.logging import info, error, debug

# sio = sock
install()


@sio.on("newPlan")
def new_toolchain():
    debug(session)
    session.pop("plan", None)
    new_toolchain = Toolchain(socket=sio)
    debug(new_toolchain)
    session["plan"] = new_toolchain
    debug("toolchain added to session")
    debug(session["plan"])
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
    """Creates a new Toolchain from a configuration file and adds it to the session.

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
        print("Error! Could not find that tool!")
        return

    try:
        new_tool = session.get("plan").add_tool(tool_class)
    except BaseException as err:
        print(f"Error adding tool to toolchain: Unexpected {err=}, {type(err)=}")
        raise

    return new_tool.toJSON()


@sio.on("addPipe")
def add_pipe(connection):
    """Adds a pipe between two tools in the current toolchain.

    Unpacks the request JSON containing a dictionary containing startActionID,
    startPortID, endActionID, and endPortID. These are passed to the toolchains's
    addPipe method.

    Returns:
        linkdata: the data about the link that was created
    """
    session.get("plan").add_pipe(
        connection["startActionID"],
        connection["startPortID"],
        connection["endActionID"],
        connection["endPortID"],
    )

    info("Plumbing: ", "Pipe hooked up.")
    return {"pipe": connection}


@sio.on("remove_tool")
def remove_tool(tool_id):
    """Removes the specified tool from the toolchain.

    Removes the specified tool from the toolchain and returns the tool that was removed.
    """
    removed_tool = session.get("plan").remove_tool(tool_id)

    return removed_tool.toJSON()


@sio.on("remove_pipe")
def remove_pipe():
    """Removes a pipe between two tools/ports in the toolchain"""
    pass


@sio.on("removeLink")
def remove_pipe(link):
    startactionJSON, endActionJSON = session.get("plan").removeLink(
        link["startActionID"],
        link["startPortID"],
        link["endActionID"],
        link["endPortID"],
    )
    return {"startActionJSON": startactionJSON, "endActionJSON": endActionJSON}


@sio.on("moveTool")
def move_tool(info):
    session.get("plan").updateActionCoords(info["id"], info["coords"])
    return {"msg": "ok"}
