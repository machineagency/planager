import uuid
from planager.Inport import Inport
from planager.Outport import Outport
from rich import print
from rich.traceback import install


import copy

install()


class Action:
    """This is the base Action class for planager actions."""

    def __init_subclass__(cls, config: dict, **kwargs) -> None:
        # takes in the config param from the subclass
        cls.config = copy.deepcopy(config)
        super().__init_subclass__(**kwargs)

    def __init__(self, overrideConfig=None, socket=None):
        # General information
        self.outports = {}
        self.inports = {}
        self.coords = None
        self.state = {}

        if overrideConfig:
            self.id = overrideConfig["id"]
            self.displayName = overrideConfig.get("displayName", "unnamed")
            self.coords = overrideConfig.get("coords", [100, 100])
            self.state = copy.deepcopy(overrideConfig.get("state", {}))

            for inport_id, inport_config in overrideConfig["inports"].items():
                newInport = Inport(inport_id, self.id, inport_config)
                self.inports[inport_id] = newInport

            for outport_id, outport_config in overrideConfig["outports"].items():
                newOutport = Outport(outport_id, self.id, outport_config)
                self.outports[outport_id] = newOutport

        else:
            self.id = uuid.uuid4().hex
            self.displayName = self.config.get("displayName", "unnamed")
            self.state = copy.deepcopy(self.config.get("state", {}))

            for inport_id, inport_config in self.config["inports"].items():
                newInport = Inport(inport_id, self.id, inport_config)
                self.inports[inport_id] = newInport

            for outport_id, outport_config in self.config["outports"].items():
                newOutport = Outport(outport_id, self.id, outport_config)
                self.outports[outport_id] = newOutport

        self.name = self.__module__.split(".")[-1]
        self.actionType = self.__module__.split(".")

        self.update_handler = None
        self.data_handler = None
        self.ports_handler = None
        self.shouldOutportsUpdate = True
        self.shouldInportsUpdate = True
        self.socket = socket
        self.register_state_sockets()

    def register_state_sockets(self):
        for state_variable in self.state.keys():
            self.socket.on_event(f"{self.id}_{state_variable}", self.update_state)

    def update_state(self, msg):
        self.state[msg["state"]] = msg["val"]

    def updateCoords(self, coords):
        self.coords = coords

    def updateSelf(self):
        if self.update_handler:
            self.update_handler(self.toJSON())

    def addInport(self, inport_id, inport_config):
        self.inports[inport_id] = Inport(inport_id, self.id, inport_config)
        self.ports_handler(self.toJSON())

    def addOutport(self, outport_id, outport_config):
        self.outports[outport_id] = Outport(outport_id, self.id, outport_config)
        self.ports_handler(self.toJSON())

    def addLinkToOutport(self, startPortID, endAction, endPortID):
        self.outports[startPortID].addConnection(endAction, endPortID)

    def removeLinkFromOutport(self, outportID, endActionID, endPortID):
        self.outports[outportID].removeConnection(endActionID, endPortID)
        self.updateSelf()

    def addLinkToInport(self, endPortID, startActionID, startPortID):
        self.inports[endPortID].addConnection(startActionID, startPortID)

    def removeLinkFromInport(self, inportID, startActionID, startPortID):
        self.inports[inportID].removeConnection(startActionID, startPortID)
        self.updateSelf()

    def updateOutports(self, outportDict):
        for outportID, data in outportDict.items():
            self.outports[outportID].update(data, self.data_handler)

        if self.update_handler and self.shouldOutportsUpdate:
            self.updateSelf()

        return self.toJSON()

    def register_update_handler(self, handler):
        self.update_handler = handler

    def register_data_handler(self, handler):
        self.data_handler = handler

    def register_ports_handler(self, handler):
        self.ports_handler = handler

    def updateInport(self, startActionID, startPortID, inportID, value):
        self.inports[inportID].setValue(startActionID, startPortID, value)
        if self.update_handler and self.shouldInportsUpdate:
            self.updateSelf()
        self.main()
        self.receivedData(inportID)
        self.updateSelf()

    def receivedData(self, inportID):
        pass

    def init(self):
        pass

    def beforeSend(self):
        # the thing to do before the outports are updated
        raise NotImplementedError

    def main(self):
        pass

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
        return {
            "id": self.id,
            "displayName": self.displayName,
            "name": self.name,
            "actionType": self.actionType,
            "coords": self.coords,
            "outports": {
                outportID: outport.toJSON()
                for outportID, outport in self.outports.items()
            },
            "inports": {
                inportID: inport.toJSON() for inportID, inport in self.inports.items()
            },
            "state": self.state,
        }

    def __str__(self):
        outportList = "\n\t\t".join([port.__str__() for port in self.outports.values()])
        inportList = "\n\t\t".join([port.__str__() for port in self.inports.values()])
        formatted = "{}, ID: {}\n\tOUTPORTS\n\t\t{}\n\tINPORTS\n\t\t{}".format(
            self.displayName, self.id, outportList, inportList
        )
        return formatted
