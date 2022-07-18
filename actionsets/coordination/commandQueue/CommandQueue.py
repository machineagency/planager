from planager.Action import Action

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "CommandQueue.tool")) as json_file:
    CONFIG = json.load(json_file)


class CommandQueue(Action, config=CONFIG):
    def inports_updated(self, inportID):
        port_handlers = {
            "append": self.append,
            "signal": self.send,
            "batch": self.batch_add,
        }
        port_handlers[inportID]()

    def batch_add(self):
        if not self.inports["batch"]:
            return
        if len(self.inports["batch"]):
            self.state["command_queue"] = self.inports["batch"]
            # self.state.notify("command_queue")
        self.update_all()

    def update_all(self):
        self.outports["all"] = self.state["command_queue"]

    def send(self, key):
        self.outports["send"] = self.state["command_queue"][0]
        self.state["command_queue"] = self.state["command_queue"][1:]
        self.update_all()

    def append(self):
        if not self.inports["append"]:
            return

        if len(self.inports["append"]):
            self.state["command_queue"].append(self.inports["append"])
            self.state.notify("command_queue")

        self.update_all()

    def clear(self, arg):
        self.state["command_queue"] = []
        self.update_all()

    def set_selected(self, arg):
        self.outports["selected"] = self.state["command_queue"][arg]
