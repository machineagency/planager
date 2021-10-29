# from enum import Enum
import uuid
from enum import Enum


class PortType(Enum):
    IN = "in"
    OUT = "out"


class Port:
    def __init__(
        self, direction: PortType, id: str, parent_id: str, config: dict
    ):
        self.direction = direction
        self.id = id
        self.parent_id = parent_id
        self.displayName = config["displayName"]
        self.description = config["description"]
        self.value = None
        self.connections = []

    def addConnection(self, endAction, endPortID):
        self.connections.append(
            {'endAction': endAction, 'endPortID': endPortID})
        print(self.connections[0]['endAction'].id)
        return

    def removeConnection(self, endActionID, endPortID):
        raise NotImplementedError

    def update(self, newVal):
        # TODO: log the current value to the port history
        self.value = newVal
        self.updateConnections()

    def updateConnections(self):
        for connection in self.connections:
            connection['endAction'].updateInport(
                connection['endPortID'], self.value)

    def getValue(self):
        return self.value

    def setValue(self, value):
        self.value = value

    def toJSON(self):
        return {
            "id": self.id,
            "parentID": self.parent_id,
            "description": self.description,
            "value": self.value,
            "displayName": self.displayName,
            "connections": {
                (connection['endAction'].id): connection['endPortID'] for connection in self.connections}}

    def __str__(self):
        portDesc = '{}, with {} connections'.format(
            self.displayName, len(self.connections))
        return portDesc
