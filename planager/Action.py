import uuid
import copy
import json
import os.path

from planager.Inport import Inport
from planager.Outport import Outport
from planager.State import State
from planager.PortCollection import PortCollection


class Action:
    """This is the base Action class for planager actions."""

    def __init_subclass__(cls, config: dict, **kwargs) -> None:
        # takes in the config param from the subclass
        cls.config = copy.deepcopy(config)
        super().__init_subclass__(**kwargs)

    def __init__(self, overrideConfig=None, socket=None):
        # General information
        self.outports = PortCollection(self.outports_updated)
        self.inports = PortCollection(self.inports_updated)
        self.coords = None
        self.socket = socket
        self.name = self.__module__.split(".")[-1]
        self.actionType = self.__module__.split(".")

        if overrideConfig:
            self.id = overrideConfig["id"]
            self.displayName = overrideConfig.get("displayName", "unnamed")
            self.coords = overrideConfig.get("coords", [100, 100])
            self.state = State(
                copy.deepcopy(overrideConfig.get("state", {})),
                self.socket,
                self.state_updated,
                self.id,
            )

            for inport_id, inport_config in overrideConfig["inports"].items():
                self.inports.add_port(Inport(inport_id, self.id, inport_config))

            for outport_id, outport_config in overrideConfig["outports"].items():
                self.outports.add_port(Outport(outport_id, self.id, outport_config))

        else:
            self.id = uuid.uuid4().hex
            self.displayName = self.config.get("displayName", "unnamed")
            self.state = State(
                copy.deepcopy(self.config.get("state", {})),
                self.socket,
                self.state_updated,
                self.id,
            )

            for inport_id, inport_config in self.config["inports"].items():
                # newInport = Inport(inport_id, self.id, inport_config)
                # self.inports[inport_id] = newInport
                self.inports.add_port(Inport(inport_id, self.id, inport_config))

            for outport_id, outport_config in self.config["outports"].items():
                self.outports.add_port(Outport(outport_id, self.id, outport_config))
                # if outport_config.get("state"):
                #     self.state[outport_id] = outport_config.get("default", None)
                # newOutport = Outport(outport_id, self.id, outport_config)
                # self.outports[outport_id] = newOutport

        self.start_method_listener()

    def start_method_listener(self):
        self.socket.on_event(f"{self.id}_method", self.run_method_from_socket)

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

    def setup(self):
        pass

    def state_updated(self, key):
        pass

    def inports_updated(self, inportID):
        pass

    def outports_updated(self, outportID):
        pass

    def updateCoords(self, coords):
        self.coords = coords

    def updateSelf(self):
        pass

    def addInport(self, inport_id, inport_config):
        self.inports.add_port(Inport(inport_id, self.id, inport_config))

    def addOutport(self, outport_id, outport_config):
        self.outports.add_port(Outport(outport_id, self.id, outport_config))

    def updateInport(self, startActionID, startPortID, inportID, value):
        self.inports.set_inport(startActionID, startPortID, inportID, value)

        self.inports_updated(inportID)
        self.updateSelf()

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
            "state": self.state.toJSON(),
        }

    def __str__(self):
        outportList = "\n\t\t".join([port.__str__() for port in self.outports.values()])
        inportList = "\n\t\t".join([port.__str__() for port in self.inports.values()])
        formatted = "{}, ID: {}\n\tOUTPORTS\n\t\t{}\n\tINPORTS\n\t\t{}".format(
            self.displayName, self.id, outportList, inportList
        )
        return formatted
