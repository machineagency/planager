class Inport:
    def __init__(self, id: str, parent_id: str, config: dict):
        self.id = id
        self.parent_id = parent_id
        self.displayName = config["displayName"]
        self.description = config["description"]
        self.multi = False
        self.value = None
        if config["multi"]:
            self.multi = config["multi"]
            self.value = {}
        self.connections = []

    def addConnection(self, startActionID, startPortID):
        self.connections.append(
            {"startActionID": startActionID, "startPortID": startPortID}
        )

    def removeConnection(self, startActionID, startPortID):
        for index, connection in enumerate(self.connections):
            if connection["startActionID"] == startActionID:
                if connection["startPortID"] == startPortID:
                    del self.connections[index]

    def getValue(self):
        return self.value

    def setValue(self, startActionID, startPortID, value):
        valueID = "{startActionID}_{startPortID}"
        if self.multi:
            self.value[valueID] = value
        else:
            self.value = value

    def toJSON(self):
        return {
            "id": self.id,
            "outport": False,
            "parentID": self.parent_id,
            "description": self.description,
            "value": self.value,
            "displayName": self.displayName,
            "connections": {
                (connection["startActionID"]): connection["startPortID"]
                for connection in self.connections
            },
        }

    def __str__(self):
        portDesc = "Inport {}, with {} connections".format(
            self.displayName, len(self.connections)
        )
        return portDesc
