import sys

sys.path.append( '/home/hannah/projects/pyplan/py' )

from workflow.Action import Action
from workflow.Inport import Inport
from workflow.Outport import Outport

class Adder(Action):
    def __init__(self):
        self.name = "adder"
        self.inports = {
            "numbers": Inport()
        }
        self.outports = {
            "result": Outport()
        }
        self.description = "Adds numbers together."

    def main(self):
        # This is what runs when the action is run.
        result = 0
        for number in self.inports["numbers"].getContents():
            result = result + number
        
        self.outports["result"].setContents(result)
        return