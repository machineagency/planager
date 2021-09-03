import Action
import Inport
import Outport

class Adder(Action):
    def __init__(self):
        self.name = "adder"
        self.inports = [Inport(), Inport()]
        self.outports = [Outport()]
        self.description = "Adds two numbers together."

    def main(self):
        pass

    