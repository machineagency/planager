class Panel:
    #Parent class for a panel. Panels are for visualizing things about the workflow. 
    def __init__(self):
        # Panel setup
        self.name = None
        # How do we decide what it's monitoring?
        # Should be able to monitor anything that's in a port.
        # Also want actions to write to a panel. Perhaps that's a different panel type
        # Want to monitor inventory.
        # If you monitor one type, the type should then determine what is shown on the panel.
        # This could actually be really cool! You could create little diagnostic dashboards very easily.
        # How might we visualize logs? Should they update in real time?
        # Idea: A history tab with a time scrubber
        # there should be different display types that can handle different typse of information.
        # Markdown/text should be the default.
        # Should have the ability to save all info from a run and reconstruct it. that could just go in the log.
        # Can you just write the Diffs to the log for info that's not text-based?