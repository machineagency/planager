import uuid
from .Inport import Inport
from .Outport import Outport


class Action:
    """This is the base Action class for planager actions."""

    def __init__(self, config: dict):
        # General information
        self.displayName = config["displayName"]
        # self.description = config["description"]
        self.id = uuid.uuid4().hex

        try:
            self.displayText = config["display"]
        except BaseException:
            self.displayText = "Nothing to show!"

        # Set up the ports
        self.outports = {}
        self.inports = {}

        for inport_id, inport_config in config["inports"].items():
            newInport = Inport(inport_id, self.id, inport_config)
            self.inports[inport_id] = newInport

        for outport_id, outport_config in config["outports"].items():
            newOutport = Outport(outport_id, self.id, outport_config)
            self.outports[outport_id] = newOutport

        self.name = self.__module__.split(".")[-1]
        self.links = {}
        self.update_handler = None
        self.shouldOutportsUpdate = True
        self.shouldInportsUpdate = True

    def addLinkToOutport(self, startPortID, endAction, endPortID):

        self.outports[startPortID].addConnection(endAction, endPortID)

    def removeLinkFromOutport(self, outportID, endActionID, endPortID):
        self.outports[outportID].removeConnection(endActionID, endPortID)
        if self.update_handler:
            self.update_handler(self.toJSON())

    def addLinkToInport(self, endPortID, startActionID, startPortID):

        self.inports[endPortID].addConnection(startActionID, startPortID)

    def removeLinkFromInport(self, inportID, startActionID, startPortID):
        self.inports[inportID].removeConnection(startActionID, startPortID)
        if self.update_handler:
            self.update_handler(self.toJSON())

    def updateOutports(self, outportDict):
        for outportID, data in outportDict.items():
            self.outports[outportID].update(data)
        if self.update_handler and self.shouldOutportsUpdate:
            # print(self.getID(), self.send_update)
            self.update_handler(self.toJSON())

    def register_update_handler(self, handler):
        self.update_handler = handler

    def updateInport(self, inportID, value):
        self.inports[inportID].setValue(value)
        if self.update_handler and self.shouldInportsUpdate:
            self.update_handler(self.toJSON())
        self.main()

    def onReceive(self):
        raise NotImplementedError

    def beforeSend(self):
        # the thing to do before the outports are updated
        raise NotImplementedError

    def main(self):
        # Children should always override this!
        raise NotImplementedError

    def appendToLog(self):
        # Writes a statement to the action log.
        raise NotImplementedError

    def info(self):
        print(self.displayName, self.outports, self.inports)

    def export(self):
        # Export this action to the selected format.
        raise NotImplementedError

    def save(self):
        # this function is for saving this instance of the action to the
        # workflow file in json
        raise NotImplementedError

    def getID(self):
        return self.id

    def toJSON(self):
        jdict = {
            "id": self.id,
            "displayName": self.displayName,
            "name": self.name,
            "links": self.links,
            "outports": {
                outportID: outport.toJSON()
                for outportID, outport in self.outports.items()
            },
            "inports": {
                inportID: inport.toJSON() for inportID, inport in self.inports.items()
            },
        }
        return jdict

    def __str__(self):
        outportList = "\n\t\t".join([port.__str__() for port in self.outports.values()])
        inportList = "\n\t\t".join([port.__str__() for port in self.inports.values()])
        formatted = "{}, ID: {}\n\tOUTPORTS\n\t\t{}\n\tINPORTS\n\t\t{}".format(
            self.displayName, self.id, outportList, inportList
        )
        return formatted
