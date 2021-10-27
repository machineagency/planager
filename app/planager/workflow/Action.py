import uuid
from .Port import Port, PortType
from collections import OrderedDict


class Action:
    """This is the base Action class for planager actions.

    This class contains a superset of the functionality that a planager action
    should have.
    """

    def __init__(self, config: dict):
        # General information
        self.displayName = config["displayName"]
        # self.description = config["description"]
        self.id = uuid.uuid4()

        # self.name = config["name"]

        try:
            self.displayText = config["display"]
        except BaseException:
            self.displayText = "Nothing to show!"

        # Set up the ports
        # TODO: Write an ordered dict JSON pickle method
        # self.outports = OrderedDict()
        # self.inports = OrderedDict()
        self.outports = {}
        self.inports = {}

        for inport_id, inport_config in config["inports"].items():
            newInport = Port(PortType.IN, inport_id, self.id, inport_config)
            self.inports[inport_id] = newInport

        for outport_id, outport_config in config["outports"].items():
            newOutport = Port(
                PortType.OUT,
                outport_id,
                self.id,
                outport_config)
            self.outports[outport_id] = newOutport

        self.name = self.__module__.split(".")[-1]
        self.links = {}

    def display(self, content):
        """Sets the display text for this action.

        Args:
            content (string): The string to display in the action body.
        """
        self.displayText = content
        return

    def addLinkToOutport(
            self,
            startPortID,
            endActionID: uuid.UUID,
            endPortID,
            endName):
        self.outports[startPortID].addConnection(endActionID, endPortID)
        # TODO: Something about jsonpickle is broken here, shouldn't have to
        # get the ID hex
        self.links[startPortID] = {
            "endActionID": endActionID.hex,
            "endPortID": endPortID,
        }
        msg = "{} outport \"{}\" connected to {} inport \"{}\"".format(
            self.displayName, startPortID, endName, endPortID)
        print(msg)
        return

    def updateOutports(self, outportDict):
        for outportID, data in outportDict.items():
            self.outports[outportID].update(data)

    def onReceive(self):
        pass

    def beforeSend(self):
        # the thing to do before the outports are updated
        pass

    def main(self):
        # Children should always override this!
        raise NotImplementedError

    def appendToLog(self):
        # Writes a statement to the action log.
        pass

    def info(self):
        print(self.displayName, self.outports, self.inports)
        return

    def export(self):
        # Export this action to the selected format.
        pass

    def save(self):
        # this function is for saving this instance of the action to the
        # workflow file in json
        pass

    def getID(self):
        return self.id

    def __str__(self):
        outportList = "\n\t\t".join([port.__str__()
                                    for port in self.outports.values()])
        inportList = "\n\t\t".join([port.__str__()
                                    for port in self.inports.values()])
        formatted = '{}, ID: {}\n\tOUTPORTS\n\t\t{}\n\tINPORTS\n\t\t{}'.format(
            self.displayName, self.id, outportList, inportList)
        return formatted
