# from enum import Enum
import uuid
from enum import Enum


class PortType(Enum):
    IN = "in"
    OUT = "out"


class Port:
    def __init__(
        self, direction: PortType, id: str, parent_id: uuid.UUID, config: dict
    ):
        self.direction = direction
        self.id = id
        self.parent_id = parent_id
        self.displayName = config["displayName"]
        self.description = config["description"]
        self.value = None
        self.connections = []

    def addConnection(self, endActionID, endPortID):
        self.connections.append(
            {endActionID: endActionID, endPortID: endPortID})
        # print(type(endActionID))
        return

    def removeConnection(self, endActionID, endPortID):
        raise NotImplementedError

    def update(self, newVal):
        # TODO: log the current value to the port history
        self.value = newVal
        return self.value

    def getValue(self):
        return self.value

    def setValue(self, value):
        self.value = value
        return self.value

    def __str__(self):
        portDesc = '{}, with {} connections'.format(
            self.displayName, len(self.connections))
        return portDesc
