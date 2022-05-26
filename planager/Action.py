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
        self.state = {}
        self.coords = None

        if overrideConfig:
            self.id = overrideConfig["id"]
            self.displayName = overrideConfig.get("displayName", "unnamed")
            self.coords = overrideConfig.get("coords", [100, 100])
            self.state = copy.deepcopy(overrideConfig.get("state", {}))

            for inport_id, inport_config in overrideConfig["inports"].items():
                newInport = Inport(inport_id, self.id, inport_config)
                self.inports[inport_id] = newInport

            for outport_id, outport_config in overrideConfig["outports"].items():
                if outport_config.get("state"):
                    self.state[outport_id] = outport_config.get("default", None)
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
                if outport_config.get("state"):
                    self.state[outport_id] = outport_config.get("default", None)
                newOutport = Outport(outport_id, self.id, outport_config)
                self.outports[outport_id] = newOutport

        self.name = self.__module__.split(".")[-1]
        self.actionType = self.__module__.split(".")

        self.shouldOutportsUpdate = True
        self.shouldInportsUpdate = True
        self.socket = socket
        self.register_state_sockets()
        self.start_method_listener()

    def register_state_sockets(self):
        for state_variable in self.state.keys():
            self.socket.on_event(
                f"{self.id}_set_{state_variable}", self.update_state_from_socket
            )
            print("Registered socket for", state_variable)

    def start_method_listener(self):
        self.socket.on_event(f"{self.id}_method", self.run_method_from_socket)

    def update_state_from_socket(self, msg):
        self.update_state(msg["state"], msg["val"])

    def get_custom_methods(self):
        method_list = []

        # attribute is a string representing the attribute name
        for attribute in dir(self):
            # Get the attribute value
            attribute_value = getattr(self, attribute)
            # Check that it is callable
            if callable(attribute_value):
                # Filter all dunder (__ prefix) methods
                if attribute.startswith("__") == False:
                    if attribute not in dir(Action):
                        method_list.append(attribute)

        return method_list

    def run_method_from_socket(self, method_name):
        getattr(self, method_name)()

    def update_state(self, stateVar, newValue):
        self.state[stateVar] = newValue
        self.socket.emit(f"{self.id}_{stateVar}_update", newValue)
        self.state_updated()
        self.updateSelf()

    def state_updated(self):
        pass

    def inports_updated(self):
        pass

    def updateCoords(self, coords):
        self.coords = coords

    def updateSelf(self):
        print("updating")

    def addInport(self, inport_id, inport_config):
        self.inports[inport_id] = Inport(inport_id, self.id, inport_config)

    def addOutport(self, outport_id, outport_config):
        self.outports[outport_id] = Outport(outport_id, self.id, outport_config)

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

    def update_outport(self, outportName, value):
        self.outports[outportName].update(value)
        self.updateSelf()

    def updateOutports(self, outportDict):
        for outportID, data in outportDict.items():
            self.outports[outportID].update(data)

        return self.toJSON()

    def updateInport(self, startActionID, startPortID, inportID, value):
        self.inports[inportID].setValue(startActionID, startPortID, value)

        self.inports_updated()
        self.updateSelf()

    def receivedData(self, inportID):
        pass

    def setup(self):
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
