import datetime
import Action


class Workflow:
    def __init__(self, name=None, author=None):
        # General information
        self.name = name
        self.author = author
        self.date = None
        self.description = None

        # Sequence specification
        self.actionSequence = []
        self.panels = []
        self.entry = None  # How do we specify an entry point? How would you execute?

        # Logging and debugging
        self.history = []
        self.history.append(
            {"message": "Instantiation", "time": datetime.time})

    def setDescription(self, desc):
        self.description = desc
        return self.description

    def saveToJSON(self):
        # Exports the content of this workflow to a JSON file.
        pass

    def addAction(self):
        # Adds an action to the collection of workflow actions
        pass

    def addLink(self):
        # Adds a link between two actions
        pass

    def removeAction(self):
        # Removes an action and any links connected to it
        pass

    def removeLink(self):
        # Removes a link between two actions
        pass

    def createSubroutine(self):
        # Not sure how to implement this yet.
        pass

    def execute(self):
        # This runs the workflow, starting from the entry point. Any entry points require default values.
        pass

    def getEndPoints(self):
        #returns the actions and port ids that are require to make the workflow runnable
        pass

    def writeHistory(self, entry):
        # Appends a new entry to the workflow's log
        self.history.append({
            "message": entry,
            "time": datetime.time
        })
        return self.history
