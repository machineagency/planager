from ...workflow.Action import Action


class Adder(Action):
    def __init__(self):
        Action.__init__(self)
        self.displayName = "Add"

    def main(self):
        # This is what runs when the action is run.
        result = 0
        for number in self.inports["numbers"].getContents():
            result = result + number

        self.outports["result"].setContents(result)
        return