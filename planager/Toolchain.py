class Toolchain:
    def __init__(
        self,
        tool_library=None,
        socket=None,
        src=None,
    ):
        self.actions = {}
        self.socket = socket
        self.tool_library = tool_library
        if src:
            self.build_toolchain_from_src(src)

    def build_toolchain_from_src(self, src):
        # This code is disgusting do not look at this
        # Iterates through to add the tools to the toolchain
        print("Building toolchain from source")

        tool_list = src["actions"].items()
        tool_ids = set(src["actions"].keys())
        added_tools = set()

        def add_pipes():
            # Once they're added, we can connect them
            for tool_id, tool_info in tool_list:
                for port_id, port_info in tool_info["outports"].items():
                    for end_tool_id, end_port_id in port_info["connections"].items():
                        new_pipe = self.addPipe(
                            tool_id, port_id, end_tool_id, end_port_id
                        )
                        self.socket.emit("pipeConnected", new_pipe)

        def tool_added_callback(tool_id):
            added_tools.add(tool_id)
            if tool_ids == added_tools:
                # If all tools have been added, add the pipes
                add_pipes()

        for tool_id, tool_info in tool_list:
            tool_type = tool_info["actionType"]
            tool_class = self.tool_library.get_tool_class(tool_type[-3], tool_type[-2])
            new_tool = self.add_tool(tool_class, overrideConfig=tool_info)
            self.socket.emit(
                "toolAdded", new_tool.toJSON(), callback=tool_added_callback
            )

    def add_tool(self, NewToolClass, overrideConfig=None):
        """
        Instantiates and adds an unconnected tool to the toolchain.

        Args:
            NewToolClass (Tool): Child class of Tool

        Returns:
            Tool: The instantiated tool of type NewToolClass.
        """
        if overrideConfig:
            new_action = NewToolClass(overrideConfig=overrideConfig, socket=self.socket)
        else:
            new_action = NewToolClass(socket=self.socket)

        new_action.setup()
        self.actions[new_action.id] = new_action
        return self.actions[new_action.id]

    def remove_tool(self, tool_id):
        """Removes the specified tool and returns it."""
        removed_tool = self.actions[tool_id]

        # Remove any incoming connections to the inports
        for inport_id, inport in removed_tool.inports.items():
            for connection in inport.connections:
                self.remove_pipe(
                    connection["startActionID"],
                    connection["startPortID"],
                    tool_id,
                    inport_id,
                )

        # Remove any outgoing connections from the outports
        for outport_id, outport in removed_tool.outports.items():
            for connection in outport.connections:
                self.remove_pipe(
                    tool_id,
                    outport_id,
                    connection["endAction"].id,
                    connection["endPortID"],
                )

        return self.actions.pop(tool_id)

    def addPipe(self, startActionID, startPortID, endActionID, endPortID):
        """Adds a pipe between two tools in the Toolchain.

        Uses the ids of tools and ports to update the Toolchain data structure. Sets the contents of the starting port to the contents of the destination port.

        Args:
            startActionID (uid): ID of the start action
            startPortID (uid): ID of the starting port
            endActionID (uid): ID of the end action
            endPortID (uid): ID of the destination port

        Returns:
            tuple: a tuple containing the updated JSON representations of the start and end actions after the pipe has been created.
        """

        self.actions[startActionID].outports.add_connection(
            startPortID, self.actions[endActionID], endPortID
        )
        self.actions[endActionID].inports.add_connection(
            endPortID, startActionID, startPortID
        )
        # Assign the start port contents to the destination port
        self.actions[endActionID].updateInport(
            startActionID,
            startPortID,
            endPortID,
            self.actions[startActionID].outports[startPortID],
        )
        return {
            "startActionID": startActionID,
            "startPortID": startPortID,
            "endActionID": endActionID,
            "endPortID": endPortID,
        }

    def remove_pipe(self, startActionID, startPortID, endActionID, endPortID):

        self.actions[startActionID].outports.remove_connection(
            startPortID, endActionID, endPortID
        )

        self.actions[endActionID].inports.remove_connection(
            endPortID, endActionID, endPortID
        )
        return (
            self.actions[startActionID].toJSON(),
            self.actions[endActionID].toJSON(),
        )

    def updateActionCoords(self, actionID, coords):
        self.actions[actionID].updateCoords(coords)

    def toJSON(self):
        """
        Creates a JSON version of a Toolchain

        Returns:
            json: JSON representation of a Toolchain
        """
        return {
            "actions": {
                actionID: action.toJSON() for actionID, action in self.actions.items()
            }
        }

    def __str__(self):
        al = "\n".join([a.__str__() for a in self.actions.values()])

        formatted_output = "Toolchain object. Tool list:\n{}".format(al)

        return formatted_output
