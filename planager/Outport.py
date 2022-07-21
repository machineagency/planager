class Outport:
    def __init__(self, id: str, parent_id: str, config: dict):
        self.id = id
        self.parent_id = parent_id
        self.displayName = config.get("displayName", id)
        self.description = config.get("description", None)
        self.value = config.get("default", None)
        self.connections = []

    def addConnection(self, endAction, endPortID):
        self.connections.append({"endAction": endAction, "endPortID": endPortID})

    def removeConnection(self, endActionID, endPortID):
        for index, connection in enumerate(self.connections):
            if connection["endAction"].id == endActionID:
                if connection["endPortID"] == endPortID:
                    del self.connections[index]

    def update(self, newVal):
        # TODO: log the current value to the port history
        self.value = newVal
        self.updateConnections()

    def updateConnections(self):
        for connection in self.connections:
            connection["endAction"].updateInport(
                self.parent_id, self.id, connection["endPortID"], self.value
            )

    def getValue(self):
        return self.value

    def setValue(self, value):
        self.value = value

    def toJSON(self):
        return {
            "id": self.id,
            "outport": True,
            "parentID": self.parent_id,
            "description": self.description,
            "displayName": self.displayName,
            "connections": {
                (connection["endAction"].id): connection["endPortID"]
                for connection in self.connections
            },
        }

    def __str__(self):
        portDesc = "Outport {}, with {} connections".format(
            self.displayName, len(self.connections)
        )
        return portDesc
