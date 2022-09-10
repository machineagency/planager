from planager.logging import message


class Toolchain:
    def __init__(
        self,
        tool_library=None,
        socket=None,
        src=None,
    ):
        self.tools = {}
        self.socket = socket
        self.tool_library = tool_library
        if src:
            self.build_toolchain_from_src(src)

    def build_toolchain_from_src(self, src):
        # This code is disgusting do not look at this
        # Iterates through to add the tools to the toolchain
        message("TOOLCHAIN: ", "Building toolchain from source")

        tool_list = src["tools"].items()
        tool_ids = set(src["tools"].keys())
        added_tools = set()

        def add_pipes():
            # Once they're added, we can connect them
            for tool_id, tool_info in tool_list:
                for port_id, port_info in tool_info["outports"].items():
                    for pipe in port_info["pipes"]:
                        dest_tool_id, dest_port_id = pipe.split("_")
                        new_pipe = self.add_pipe(
                            tool_id, port_id, dest_tool_id, dest_port_id
                        )
                        self.socket.emit("pipe_added", new_pipe)

        def tool_added_callback(tool_id):
            added_tools.add(tool_id)
            if tool_ids == added_tools:
                # If all tools have been added, add the pipes
                add_pipes()

        for tool_id, tool_info in tool_list:
            tool_type = tool_info["toolType"]
            tool_class = self.tool_library.get_tool_class(tool_type[-3], tool_type[-2])
            new_tool = self.add_tool(tool_class, overrideConfig=tool_info)
            self.socket.emit(
                "tool_added", new_tool.toJSON(), callback=tool_added_callback
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
            new_tool = NewToolClass(overrideConfig=overrideConfig, socket=self.socket)
        else:
            new_tool = NewToolClass(socket=self.socket)

        new_tool.setup()
        self.tools[new_tool.id] = new_tool
        return self.tools[new_tool.id]

    def remove_tool(self, tool_id):
        """Removes the specified tool and returns it."""
        removed_tool = self.tools[tool_id]

        # Remove any incoming pipes to the inports
        for inport_id, inport in removed_tool.inports.items():
            pipes = list(inport.pipes.keys())
            for pipe in pipes:
                origin_tool_id, origin_port_id = pipe.split("_")
                self.remove_pipe(origin_tool_id, origin_port_id, tool_id, inport_id)

        # Remove any outgoing pipes from the outports
        for outport_id, outport in removed_tool.outports.items():
            pipes = list(outport.pipes.keys())
            for pipe in pipes:
                dest_tool, dest_port = pipe.split("_")
                self.remove_pipe(tool_id, outport_id, dest_tool, dest_port)

        return self.tools.pop(tool_id)

    def add_pipe(
        self, origin_tool_id, origin_port_id, destination_tool_id, destination_port_id
    ):
        """Adds a pipe between two tools in the Toolchain.

        Uses the ids of tools and ports to update the Toolchain data structure. Sets the contents of the starting port to the contents of the destination port.

        Args:
            origin_tool_id (uid): ID of the start tool
            origin_port_id (uid): ID of the starting port
            destination_tool_id (uid): ID of the end tool
            destination_port_id (uid): ID of the destination port

        Returns:
            tuple: a tuple containing the updated JSON representations of the start and end tools after the pipe has been created.
        """

        self.tools[origin_tool_id].outports.add_pipe(
            origin_port_id, self.tools[destination_tool_id], destination_port_id
        )
        self.tools[destination_tool_id].inports.add_pipe(
            destination_port_id, origin_tool_id, origin_port_id
        )
        # Assign the start port contents to the destination port
        self.tools[destination_tool_id].update_inport(
            origin_tool_id,
            origin_port_id,
            destination_port_id,
            self.tools[origin_tool_id].outports[origin_port_id],
        )
        return {
            "origin_tool_id": origin_tool_id,
            "origin_port_id": origin_port_id,
            "destination_tool_id": destination_tool_id,
            "destination_port_id": destination_port_id,
        }

    def remove_pipe(self, start_tool_id, start_port_id, end_tool_id, end_port_id):
        """Removes a pipe between two tools in a Toolchain."""
        # TODO: Pipes should be individual objects. Right now, they're managed by both the inports and outports.

        self.tools[start_tool_id].outports.remove_pipe(
            start_port_id, end_tool_id, end_port_id
        )

        self.tools[end_tool_id].inports.remove_pipe(
            end_port_id, start_tool_id, start_port_id
        )

        self.socket.emit(
            "pipe_removed",
            {
                "start_tool_id": start_tool_id,
                "end_tool_id": end_tool_id,
                "start_port_id": start_port_id,
                "end_port_id": end_port_id,
            },
        )

        return (
            self.tools[start_tool_id].toJSON(),
            self.tools[end_tool_id].toJSON(),
        )

    def update_tool_coordinates(self, tool_id, coordinates):
        self.tools[tool_id].updateCoords(coordinates)

    def toJSON(self):
        """Creates a JSON version of a Toolchain

        Returns:
            json: JSON representation of a Toolchain
        """
        return {
            "tools": {tool_id: tool.toJSON() for tool_id, tool in self.tools.items()}
        }

    def __str__(self):
        al = "\n".join([a.__str__() for a in self.tools.values()])

        formatted_output = "Toolchain object. Tool list:\n{}".format(al)

        return formatted_output
