from planager.Tool import Tool

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "EventQueue.tool")) as json_file:
    CONFIG = json.load(json_file)


class EventQueue(Tool, config=CONFIG):
    def inports_updated(self, inportID):
        port_handlers = {
            "append": self.append,
            "signal": self.signal,
            "batch": self.batch_add,
        }
        port_handlers[inportID]()

    # def lock(self):
    #     self.state["locked"] = self.inports["lock"]

    def batch_add(self):
        if not self.inports["batch"]:
            return
        if len(self.inports["batch"]):
            self.state["command_queue"] = self.inports["batch"]
            # self.state.notify("command_queue")
        self.update_all()

    def signal(self):
        newtime = self.inports["signal"]
        currtime = self.state["current_time"]
        if newtime == currtime:
            return
        else:
            self.state["current_time"] = newtime
            self.send(None)

    def update_all(self):
        self.outports["all"] = self.state["command_queue"]

    def send(self, key):
        if not self.state["command_queue"]:
            return
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
