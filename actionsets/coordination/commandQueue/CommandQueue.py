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
            "addCommand": self.add_command,
            "signal": self.send,
            "batch": self.batch_add,
        }
        port_handlers[inportID]()

    def batch_add(self):
        if not self.inports["batch"]:
            return
        if len(self.inports["batch"]):
            self.state["command_queue"].extend(self.inports["batch"])
            self.state.notify("command_queue")

    def send(self, key):
        self.outports["command"] = self.state["command_queue"][0]
        self.state["command_queue"] = self.state["command_queue"][1:]

    def add_command(self):
        if not self.inports["addCommand"]:
            return
        if len(self.inports["addCommand"]):
            self.state["command_queue"].append(self.inports["addCommand"][-1])
            self.state.notify("command_queue")
