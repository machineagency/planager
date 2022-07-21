"""Stitch definitions are used to construct a stitch at compile time"""
from enum import Enum
from typing import List, Optional

from ...knit_graphs.Knit_Graph import Pull_Direction


class Stitch_Lean(Enum):
    """
    An enumeration that determines the direction the stitch leans
    """
    Left = "left"
    Right = "right"
    Center = "center"

    def __str__(self):
        if self is Stitch_Lean.Left:
            return "l"
        elif self is Stitch_Lean.Right:
            return "r"
        else:
            return "c"

    def offset_direction(self) -> int:
        """
        :return: the direction of offsets to make this lean
        """
        if self is Stitch_Lean.Left:
            return 1
        elif self is Stitch_Lean.Right:
            return -1
        else:
            return 0

    def flip(self):
        """
        :return: opposite stitch-lean direction
        """
        if self is Stitch_Lean.Left:
            return Stitch_Lean.Right
        elif self is Stitch_Lean.Right:
            return Stitch_Lean.Left
        else:
            return self


class Stitch_Definition:
    """
    A class used to define how a stitch edge should be created
    ...

    Attributes
    ----------
    offset_to_parent_loops : integer
        a stack of offsets from child loop to parent loop in prior course.
         Stack order implies stacking order of parent loops through child
    pull_direction:
        the direction to pull the child loop through the parents
    cabling_depth:
        the depth of this stitch crossing over stitches.
    """

    def __init__(self, pull_direction: Pull_Direction = Pull_Direction.BtF, cabling_depth: int = 0,
                 offset_to_parent_loops: Optional[List[int]] = None, child_loops: int = 1):
        self.child_loops = child_loops
        if offset_to_parent_loops is None:
            offset_to_parent_loops = [0]
        self.offset_to_parent_loops: List[int] = offset_to_parent_loops
        self.pull_direction: Pull_Direction = pull_direction
        self.cabling_depth = cabling_depth

    @property
    def is_decrease(self) -> bool:
        """
        :return: true if multiple parents are used in stitch
        """
        return len(self) > 1

    @property
    def lean(self) -> Stitch_Lean:
        """
        A stitch leans in the direction of the sum of its offsets
        left < 0 = center < right
        :return: the direction the stitch leans
        """
        total = sum(*self.offset_to_parent_loops)
        if total == 0:
            return Stitch_Lean.Center
        elif total < 0:
            return Stitch_Lean.Left
        else:
            return Stitch_Lean.Right

    def flip(self):
        """
        switches the pull_direction and the lean of the stitch
        """
        if self.pull_direction is Pull_Direction.BtF:
            self.pull_direction = Pull_Direction.FtB
        else:
            self.pull_direction = Pull_Direction.BtF
        new_offsets = [offset * -1 for offset in reversed(self.offset_to_parent_loops)]
        self.offset_to_parent_loops = new_offsets

    def copy(self):
        """
        :return: a deep copy of this stitch definition
        """
        definition = Stitch_Definition(pull_direction=self.pull_direction, cabling_depth=self.cabling_depth,
                                       offset_to_parent_loops=self.offset_to_parent_loops, child_loops=self.child_loops)
        return definition

    def copy_and_flip(self):
        """
        :return: a deep copy of stitch that is flipped
        """
        copy = self.copy()
        copy.flip()
        return copy

    def __eq__(self, other):
        instance = isinstance(other, Stitch_Definition)
        count = len(self) == len(other)
        direction = self.pull_direction == other.pull_direction
        depth = self.cabling_depth == other.cabling_depth
        off_set = count
        if off_set:
            for myParent, otherParent in zip(self.offset_to_parent_loops, other.offset_parent_loops):
                if myParent != otherParent:
                    off_set = False
                    break
        return instance and count and direction and depth and off_set

    def __str__(self):
        return f"{len(self)}-{self.pull_direction}-c{self.cabling_depth}->{self.child_loops}"

    def __repr__(self):
        return str(self)

    def __len__(self) -> int:
        return len(self.offset_to_parent_loops)
