class Plan:
    def __init__(self):
        # Representation of a workflow when it is loaded into an environment.
        self.name = None
        self.date = None
        self.author = None
        self.description = None

        self.actionSequence = []
        #

        self.panels = []

        self.entry = None  # How do we specify an entry point? How would you execute?
        self.debug = False # debugging is specific to this environment and workflow
        

    def saveToJSON(self):
        #Exports the content of this workflow to a JSON file.
        pass
