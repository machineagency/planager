class PortCollection:
    def __init__(self, callback, socket, parent_id):
        self._ports = {}
        self._callback = callback
        self.socket = socket
        self.parent_id = parent_id

    def add_port(self, port):
        self._ports[port.id] = port

    def add_pipe(self, port_id, tool, end_port_id):
        self._ports[port_id].add_pipe(tool, end_port_id)

    def remove_pipe(self, port_id, tool_id, end_port_id):
        # TODO: Rename this. remove_pipe should not be the same method name for different classes
        self._ports[port_id].remove_pipe(tool_id, end_port_id)

    def set_inport_value(self, origin_tool_id, origin_port_id, inport_id, value):
        self._ports[inport_id].setValue(origin_tool_id, origin_port_id, value)
        self.socket.emit(
            f"{self.parent_id}_inport_{inport_id}", self._ports[inport_id].value
        )

    def items(self):
        return self._ports.items()

    def ports(self):
        return self._ports.keys()

    def __getitem__(self, port_id):
        return self._ports[port_id].value

    def __setitem__(self, port_id, value):
        self._ports[port_id].update(value)
        self._callback(port_id)
