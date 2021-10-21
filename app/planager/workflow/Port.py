# from enum import Enum
from uuid import uuid4


class PortType:
    IN = "IN"
    OUT = "OUT"


class Port:
    def __init__(self, direction: PortType, id: str, parent_id: uuid4, config: dict):
        self.direction = direction
        self.id = id
        self.parent_id = parent_id
        self.displayName = config["displayName"]
        self.description = config["description"]
        self.value = None
        self.connections = []

    def addConnection(self, endActionID, endPortID):
        self.connections.append({endActionID: endActionID, endPortID: endPortID})

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
