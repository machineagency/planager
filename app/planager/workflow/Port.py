class Port:
    def __init__(self):
        self.portType = 1 # Boolean between in or out?
        self.info = None # Information contained in the port.
        self.infoType = None # Type of the information. could be a primitive or a planagertype
        #Should there even be a distinction between inports and outports? 
        # Are they really just the same thing but we impose a separation between them with a link?
        # Maybe we could think of them as holding areas for information/status/assets whatever

        # Logging and debugging
        self.portLog = [] # log of 
        self.history = [] # History of values that went through this port.
        self.historyLimit = 0 # Limit of how many history entries to store?


    def typeCheck(self):
        # Checks to see if the type is appropriate.
        pass

    def update(self):
        # updates the information in the port.
        pass

    def formatPanel(self):
        #Formats the information in the port in a way that is readable through an info panel.
        pass

    def addToPortLog(self):
        #adds info to the port log
        pass