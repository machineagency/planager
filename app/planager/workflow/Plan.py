class Plan:
    def __init__(self):
        self.actions = {}

    def addAction(self, NewActionClass):
        """
        Instantiates and adds an unconnected action to the plan.

        Args:
            NewActionClass (Action): Child class of Action

        Returns:
            Action: The instantiated action of type NewActionClass.
        """
        new_action = NewActionClass()
        self.actions[new_action.id] = new_action
        return

    def removeAction(self, actionID):
        """Removes the specified action from the plan."""
        del self.actions[actionID]

    def addLink(self, startActionID, startPortID, endActionID, endPortID):
        self.actions[startActionID].addLinkToOutport(
            startPortID, self.actions[endActionID], endPortID)

    def removeLink(self):
        raise NotImplementedError

    def toJSON(self):
        """
        Creates a JSON version of a Plan

        Returns:
            json: JSON representation of a Plan
        """
        jdict = {"actions": {actionID: action.toJSON()
                 for actionID, action in self.actions.items()}}

        return jdict

    def __str__(self):
        al = "\n".join([a.__str__() for a in self.actions.items()])

        formatted_output = '''Plan object. Action list:\n{}'''.format(al)

        return formatted_output
