class PortCollection:
    def __init__(self, callback):
        self._ports = {}
        self._callback = callback

    def add_port(self, port):
        self._ports[port.id] = port

    def add_connection(self, port_id, action, end_port_id):
        self._ports[port_id].addConnection(action, end_port_id)

    def remove_connection(self, port_id, action_id, end_port_id):
        self._ports[port_id].removeConnection(action_id, end_port_id)

    def set_inport(self, startActionID, startPortID, inportID, value):
        self._ports[inportID].setValue(startActionID, startPortID, value)

    def __getitem__(self, port_id):
        return self._ports[port_id].value

    def __setitem__(self, port_id, value):
        self._ports[port_id].update(value)
        self._callback(port_id)

    def items(self):
        return self._ports.items()
