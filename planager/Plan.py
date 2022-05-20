from typing import Dict


class Plan:
    def __init__(
        self,
        update_handler=None,
        headless=False,
        data_handler=None,
        ports_handler=None,
        action_manager=None,
        socket=None,
        src=None,
    ):
        self.actions = {}
        self.socket = socket
        self.update_handler = update_handler
        self.data_handler = data_handler
        self.ports_handler = ports_handler
        self.headless = headless
        self.action_manager = action_manager
        if src:
            self.build_plan_from_src(src)

    def build_plan_from_src(self, src):
        # Iterates through to add the actions to the plan
        for action_id, action_info in src["actions"].items():
            action_type = action_info["actionType"]
            action_class = self.action_manager.get_action_class(
                action_type[-3], action_type[-2]
            )
            self.addAction(action_class, overrideConfig=action_info)

        # Once they're added, we can connect them
        for action_id, action_info in src["actions"].items():
            for port_id, port_info in action_info["outports"].items():
                for end_action_id, end_port_id in port_info["connections"].items():
                    self.addLink(action_id, port_id, end_action_id, end_port_id)

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
        # If there is a place to send updates, register it with the action
        if self.update_handler:
            new_action.register_update_handler(self.update_handler)
        if self.data_handler:
            new_action.register_data_handler(self.data_handler)
        if self.ports_handler:
            new_action.register_ports_handler(self.ports_handler)

        new_action.init()
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

    def addLink(self, startActionID, startPortID, endActionID, endPortID):
        """Adds a link between two actions in the plan.

        Uses the ids of actions and ports to update the plan data structure. Sets the contents of the starting port to the contents of the destination port.

        Args:
            startActionID (uid): ID of the start action
            startPortID (uid): ID of the starting port
            endActionID (uid): ID of the end action
            endPortID (uid): ID of the destination port

        Returns:
            tuple: a tuple containing the updated JSON representations of the start and end actions after the link has been created.
        """
        # print("adding connection between", startPortID, "and", endPortID)
        self.actions[startActionID].addLinkToOutport(
            startPortID, self.actions[endActionID], endPortID
        )
        self.actions[endActionID].addLinkToInport(endPortID, startActionID, startPortID)
        # Assign the start port contents to the destination port
        self.actions[endActionID].updateInport(
            startActionID,
            startPortID,
            endPortID,
            self.actions[startActionID].outports[startPortID].value,
        )
        return (
            self.actions[startActionID].toJSON(),
            self.actions[endActionID].toJSON(),
        )

    def removeLink(self, startActionID, startPortID, endActionID, endPortID):
        # print("removing connection between", startPortID, "and", endPortID)
        self.actions[startActionID].removeLinkFromOutport(
            startPortID, endActionID, endPortID
        )
        self.actions[endActionID].removeLinkFromInport(
            endPortID, startActionID, startPortID
        )
        return (
            self.actions[startActionID].toJSON(),
            self.actions[endActionID].toJSON(),
        )

    def updateActionCoords(self, actionID, coords: Dict):
        self.actions[actionID].updateCoords(coords)

    def sendDataToOutport(self, actionID, data: Dict):
        return self.actions[actionID].updateOutports(data)

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
