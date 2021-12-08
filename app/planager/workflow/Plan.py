from typing import Dict


class Plan:
    def __init__(self, update_handler=None):
        self.actions = {}
        self.update_handler = update_handler

    def addAction(self, NewActionClass):
        """
        Instantiates and adds an unconnected action to the plan.

        Args:
            NewActionClass (Action): Child class of Action

        Returns:
            Action: The instantiated action of type NewActionClass.
        """
        new_action = NewActionClass()
        # If there is a place to send updates, register it with the action
        if self.update_handler:
            new_action.register_update_handler(self.update_handler)
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
        self.actions[startActionID].addLinkToOutport(
            startPortID, self.actions[endActionID], endPortID
        )
        self.actions[endActionID].addLinkToInport(endPortID, startActionID, startPortID)

    def removeLink(self, startActionID, startPortID, endActionID, endPortID):
        self.actions[startActionID].removeLinkFromOutport(
            startPortID, endActionID, endPortID
        )
        self.actions[endActionID].removeLinkFromInport(
            endPortID, startActionID, startPortID
        )
        print(self)

    def sendDataToOutport(self, actionID, data: Dict):
        print(self)
        self.actions[actionID].updateOutports(data)
        print(self)

    def toJSON(self):
        """
        Creates a JSON version of a Plan

        Returns:
            json: JSON representation of a Plan
        """
        jdict = {
            "actions": {
                actionID: action.toJSON() for actionID, action in self.actions.items()
            }
        }

        return jdict

    def __str__(self):
        al = "\n".join([a.__str__() for a in self.actions.values()])

        formatted_output = """Plan object. Action list:\n{}""".format(al)

        return formatted_output
