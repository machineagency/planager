import sys

sys.path.append( '/home/hannah/projects/pyplan/py' )

from workflow.Action import Action
from workflow.Inport import Inport
from workflow.Outport import Outport


class Constant(Action):
    def __init__(self):
        self.name = "adder"
        self.inports = {}
        self.outports = {
            "constant": Outport()
        }
        self.description = "Stores a constant"
        self.value = 0

    def main(self):
        # Puts the value into the outport.
        self.outports["constant"].setContents(self.value)
        return