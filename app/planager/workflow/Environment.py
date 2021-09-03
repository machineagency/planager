class Environment:
    def __init__(self):
        # Loads and displays a workflow.
        self.name = None
        self.date = None
        self.author = None
        self.description = None

        self.actionSequence = []
        #

        self.panels = []

        self.entry = None  # How do we specify an entry point? How would you execute?

    def saveToJSON(self):
        #Exports the content of this workflow to a JSON file.
        pass
