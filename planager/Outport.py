class Outport:
    def __init__(self, id: str, parent_id: str, config: dict):
        self.id = id
        self.parent_id = parent_id
        self.displayName = config.get("displayName", id)
        self.description = config.get("description", None)
        self.value = config.get("default", None)
        self.pipes = {}

    def add_pipe(self, destination_tool, destination_port_id):
        destination_id = f"{destination_tool.id}_{destination_port_id}"
        self.pipes[destination_id] = {
            "destination_tool": destination_tool,
            "destination_port": destination_port_id,
        }

    def remove_pipe(self, destination_tool_id, destination_port_id):
        destination_id = f"{destination_tool_id}_{destination_port_id}"
        del self.pipes[destination_id]

    def update(self, newVal):
        # TODO: log the current value to the port history
        self.value = newVal
        self.update_pipes()

    def update_pipes(self):
        for destination_id in self.pipes.keys():
            tool_to_update = self.pipes[destination_id]["destination_tool"]
            port_to_update = self.pipes[destination_id]["destination_port"]
            tool_to_update.updateInport(
                self.parent_id, self.id, port_to_update, self.value
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
            "pipes": list(self.pipes.keys()),
        }

    def __str__(self):
        portDesc = "Outport {}, with {} connections".format(
            self.displayName, len(self.pipes)
        )
        return portDesc
