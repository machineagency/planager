class State:
    def __init__(self, initial_state, socket, after_update, parent_id):
        self._store = initial_state
        self.socket = socket
        self.state_did_update = after_update
        self.parent_id = parent_id

        for state_variable in self._store.keys():
            self.open_socket(state_variable)

    def __getitem__(self, key):
        return self._store[key]

    def __setitem__(self, key, value):
        self._store[key] = value
        self.socket.emit(f"{self.parent_id}_{key}_update", value)
        self.state_did_update(key)

    def open_socket(self, state_variable):
        if not self.socket:
            return
        self.socket.on_event(
            f"{self.parent_id}_set_{state_variable}", self.update_from_socket
        )

    def update_from_socket(self, message):
        self.__setitem__(message["state"], message["val"])

    def keys(self):
        return self._store.keys()

    def toJSON(self):
        return self._store
