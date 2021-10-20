import uuid

class Action:
    def __init__(self):
        # General information
        self.name = None
        self.id = uuid.uuid4()
        self.description = None
        # self.author = None
        # self.help = None # perhaps a link to documentation about this action. would be nice to be markdown for nice rendering
        self.version = 1.0 # Version of this action. Could be useful for logging, but also could push updates to people as they use planager.

        # Define input and output information
        # self.inportsVariable = False #if the number of imports is static or variable
        # might actually not need this. grasshopper just combines everything into one and allows you to choose how things are listed
        self.outports = []
        self.inports = []
        # I believe inports and outports should be an ordered collection of the appropriate classes. We want the order to remain the same, but a list might not be the right way of implementing this.


        # Conditions for running the main loop of the action and therefore refreshing output
        # self.updateMethod = None #how to do python enums?
        # types should be immediate, on signal, interval... is there a custom?
        # How is running the main loop of the action different from actions that have self-updating main loops? How to represent this?
        # Actions should have explicit support for at least one update method.
        # What if the global workspace could have a debug mode that switches all actions to "on intervention", which is like a debug step mode.
        # Maybe read more about debuggers.

        # self.exportTo = None
        # A list of file formats that this action can be exported to. Example: PAML
        # Need to best figure out how to implement this. Maybe the export function should be at the workflow level?
        # I think it should be at the action level though, then the actions are export format agnostic.


        # Agent setup and information.
        # self.agent = None
        # what can carry out this code? default will be python, where no additional input is required
        # there should be a planager agent class that can be defined. could make agents like "lab tech"
        # agent must be found and connected to in order to execute the workflow
        # agent could be manual
        # can be linked to physical resources. compilation assigns agents?
        # The agent should have types that limit running of the 

        # self.simulate = None
        # Should have separate instructions for what to do when simulating. Perhaps this is passed in on runtime.

        # Definitely need to have a log. This could be sent with the information when it passes information on from the outports.
        # self.actionLog = []

        # This boolean reports to the environment if the action is currently running. 
        # self.active = False
        # could allow reporting of errors, highlighting of which one is currently working.
        # add onBecomeActive and onBecomeInactive methods?

        # we want both the CLI and interface methods.
        # self.interface = False
        # maybe this is not just boolean, instead is a enum that can support different modes?
        # people could then add different interaction support into their actions.
        # First thought: cli, node, notebook
        # View modes will need to support actions, agents, panels, ports, inventory, logs
        # Interfaces should have a default way of importing actions that maintains their functionality. 
        # might default to limited CLI interface even in node/notebook. Actions
        # can override this by having specific code for that display mode.
        # An action could list the display modes it supports explicitly, which could be useful when exploring the action library.
        # I want the interface to be able to list what actions can connect to eachother via the same input.
        
        # MORE THOUGHTS
        # - I want an easy testing framework. python unittest should be able to help.
        # - Should the action contain its own HTML or give options for generating the UI?
        #     - I think both, gives access to elements or can generate for you
        # - Should have ability to log statements.
        # - How do we manage Python dependencies? Is there a way to indicate specific dependencies in this file?
        #     - I'm thinking that we actually have a requirements.txt file that comes with each action.
        # - Action installation? How is it going to work? 

        # self.panels = None
        # What if panels were attached to the actions or ports that they represent?
        # rename ports portals?

        # self.settings = None # dictionary of settings for this action instance. can be updated in the interface

    def onReceive(self):
        pass

    def beforeSend(self):
        # the thing to do before the outports are updated
        pass

    def addInport(self):
        # For setting up the Inports.
        pass

    def addOutport(self):
        # For setting up the Outports.
        pass

    def main(self):
        # Children should always override this!
        raise NotImplementedError

    def appendToLog(self):
        # Writes a statement to the action log.
        pass

    def info(self):
        print(self.name, self.outports, self.inports)
        return

    def export(self):
        #Export this action to the selected format.
        pass

    def save(self):
        # this function is for saving this instance of the action to the workflow file in json
        pass

    def getID(self):
        return self.id