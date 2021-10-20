import jsonpickle

class Plan:
    def __init__(self):
        # Representation of a workflow when it is loaded into an environment.
        self.actions = []
        self.links = []

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
        return new_action

    def removeAction(self):
        # Should also remove the links connected to the action
        raise NotImplementedError

    def addLink(self, sender, receiver):
        # Must connect two actions
        raise NotImplementedError

    def removeLink(self):
        raise NotImplementedError
