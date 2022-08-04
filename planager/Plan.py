class Plan:
    def __init__(
        self,
        action_manager=None,
        socket=None,
        src=None,
    ):
        self.actions = {}
        self.socket = socket
        self.action_manager = action_manager
        if src:
            self.build_plan_from_src(src)

    def build_plan_from_src(self, src):
        # This code is disgusting do not look at this
        # Iterates through to add the actions to the plan
        print("Building plan from source")

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
            tool_class = self.action_manager.get_action_class(
                tool_type[-3], tool_type[-2]
            )
            new_tool = self.addAction(tool_class, overrideConfig=tool_info)
            self.socket.emit(
                "toolAdded", new_tool.toJSON(), callback=tool_added_callback
            )

    def addAction(self, NewActionClass, overrideConfig=None):
        """
        Instantiates and adds an unconnected action to the plan.

        Args:
            NewActionClass (Action): Child class of Action

        Returns:
            Action: The instantiated action of type NewActionClass.
        """
        if overrideConfig:
            new_action = NewActionClass(
                overrideConfig=overrideConfig, socket=self.socket
            )
        else:
            new_action = NewActionClass(socket=self.socket)

        new_action.setup()
        self.actions[new_action.id] = new_action
        return self.actions[new_action.id]

    def removeAction(self, actionID):
        """Removes the specified action and returns it."""
        removedAction = self.actions.pop(actionID)
        # Remove any incoming connections to the inports
        for inportID, inport in removedAction.inports.items():
            for connection in inport.connections:
                action = self.actions[connection["startActionID"]]
                startPortID = connection["startPortID"]
                action.removeLinkFromOutport(startPortID, actionID, inportID)
        # Remove any outgoing connections from the outports
        for outportID, outport in removedAction.outports.items():
            for connection in outport.connections:
                action = self.actions[connection["endAction"].id]
                endPortID = connection["endPortID"]
                action.removeLinkFromInport(endPortID, actionID, outportID)

        return removedAction

    def addPipe(self, startActionID, startPortID, endActionID, endPortID):
        """Adds a pipe between two actions in the plan.

        Uses the ids of actions and ports to update the plan data structure. Sets the contents of the starting port to the contents of the destination port.

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

    def removeLink(self, startActionID, startPortID, endActionID, endPortID):

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
        Creates a JSON version of a Plan

        Returns:
            json: JSON representation of a Plan
        """
        return {
            "actions": {
                actionID: action.toJSON() for actionID, action in self.actions.items()
            }
        }

    def __str__(self):
        al = "\n".join([a.__str__() for a in self.actions.values()])

        formatted_output = "Plan object. Action list:\n{}".format(al)

        return formatted_output
