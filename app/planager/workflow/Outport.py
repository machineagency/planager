class Outport:
    def __init__(self, id: str, parent_id: str, config: dict):
        self.id = id
        self.parent_id = parent_id
        self.displayName = config["displayName"]
        self.description = config["description"]
        self.value = None
        self.connections = []

    def addConnection(self, endAction, endPortID):
        self.connections.append({"endAction": endAction, "endPortID": endPortID})

    def removeConnection(self, endActionID, endPortID):
        for index, connection in enumerate(self.connections):
            if connection["endAction"].id == endActionID:
                if connection["endPortID"] == endPortID:
                    del self.connections[index]

    def update(self, newVal, data_handler):
        # TODO: log the current value to the port history
        self.value = newVal
        self.updateConnections(data_handler)

    def updateConnections(self, data_handler):
        for connection in self.connections:
            print(self.id, "sending data to", connection["endPortID"])
            if data_handler:
                data_handler(
                    {
                        "startActionID": self.parent_id,
                        "startPortID": self.id,
                        "endActionID": connection["endAction"].id,
                        "endPortID": connection["endPortID"],
                    }
                )
            connection["endAction"].updateInport(connection["endPortID"], self.value)

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
            "value": self.value,
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
