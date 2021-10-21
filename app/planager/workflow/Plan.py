import jsonpickle


class Plan:
    def __init__(self):
        self.actions = []

    def toJSON(self):
        """
        Creates a JSON version of a Plan using jsonpickle

        Returns:
            json: JSON representation of a Plan
        """
        return jsonpickle.encode(self)

    def addAction(self, NewActionClass):
        """
        Instantiates and adds an unconnected action to the plan.

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
        endName = "undefined"
        for action in self.actions:
            if action.getID() == endActionID:
                endName = action.displayName
        for action in self.actions:
            if action.getID() == startActionID:
                action.addLinkToOutport(
                    startPortID, endActionID, endPortID, endName)
        return

    def removeLink(self):
        raise NotImplementedError

    def __str__(self):
        al = "\n".join([a.__str__() for a in self.actions])

        formatted_output = '''Plan object. Action list:\n{}'''.format(al)

        return formatted_output
