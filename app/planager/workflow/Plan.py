class Plan:
    def __init__(self):
        # Representation of a workflow when it is loaded into an environment.
        self.name = None
        self.date = None
        self.author = None
        self.description = None

        self.actions = []
        self.links = []

        self.actionSequence = []
        self.panels = []

        self.entry = None  # How do we specify an entry point? How would you execute?
        self.debug = False # debugging is specific to this environment and workflow
        

    def saveToJSON(self):
        #Exports the content of this workflow to a JSON file.
        raise NotImplementedError

    def addAction(self, AddedAction):
        new_action = AddedAction()
        self.actions.append(new_action)
        return new_action

    def removeAction(self):
        # Should also remove the links connected to the action
        raise NotImplementedError

    def addLink(self, sender, receiver):
        # Must connect two actions
        raise NotImplementedError

    def removeLink(self):
        raise NotImplementedError