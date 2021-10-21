import jsonpickle

class Plan:
    def __init__(self):
        # Representation of a workflow when it is loaded into an environment.
        self.actions = []

    def toJSON(self):
        """
        toJSON creates a JSON version of a Plan using jsonpickle

        Returns:
            json: JSON representation of a Plan
        """
        return jsonpickle.encode(self)

    def addAction(self, NewActionClass):
        """
        addAction Instantiates and adds an unconnected action to the plan.

        Args:
            NewActionClass (Action): Child class of Action

        Returns:
            Action: The instantiated action of type NewActionClass.
        """
        new_action = NewActionClass()
        self.actions.append(NewActionClass())
        return

    def removeAction(self):
        # Should also remove the links connected to the action
        raise NotImplementedError

    def addLink(self, startActionID, startPortID, endActionID, endPortID):
        for action in self.actions:
            if action.getID() == startActionID:
                action.addLinkToOutport(startPortID, endActionID, endPortID)

        return startActionID

    def removeLink(self):
        raise NotImplementedError
