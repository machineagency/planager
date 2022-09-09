class Inport:
    def __init__(self, id: str, parent_id: str, config: dict):
        self.id = id
        self.parent_id = parent_id
        self.displayName = config.get("displayName", id)
        self.description = config.get("description", None)
        self.multi = config.get("multi", False)
        self.value = config.get("value", {})
        self.pipes = {}

    def add_pipe(self, origin_tool_id, origin_port_id):
        origin_id = f"{origin_tool_id}_{origin_port_id}"

        self.pipes[origin_id] = {
            "origin_tool_id": origin_tool_id,
            "origin_port_id": origin_port_id,
        }

    def remove_pipe(self, origin_tool_id, origin_port_id):
        origin_id = f"{origin_tool_id}_{origin_port_id}"

        if self.multi:
            del self.value[origin_id]
        else:
            self.value = None

        del self.pipes[origin_id]

    def getValue(self):
        return self.value

    def setValue(self, origin_tool_id, origin_port_id, value):
        if self.multi:
            value_id = f"{origin_tool_id}_{origin_port_id}"
            self.value[value_id] = value
        else:
            self.value = value

    def toJSON(self):
        return {
            "id": self.id,
            "outport": False,
            "parentID": self.parent_id,
            "description": self.description,
            "multi": self.multi,
            "displayName": self.displayName,
            "pipes": list(self.pipes.keys()),
        }

    def __str__(self):
        portDesc = "Inport {}, with {} pipes".format(self.displayName, len(self.pipes))
        return portDesc
