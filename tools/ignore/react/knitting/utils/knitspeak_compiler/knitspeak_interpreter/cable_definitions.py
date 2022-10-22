"""Cable Definition is used to construct different cable structures"""
from typing import List

from ...knit_graphs.Knit_Graph import Pull_Direction
from .stitch_definitions import Stitch_Definition, Stitch_Lean


class Cable_Definition:
    """
    A class used to organize associated stitch definitions in a cable
    """

    def __init__(self, left_crossing_loops: int = 1, right_crossing_loops: int = 1,
                 left_crossing_pull_direction: Pull_Direction = Pull_Direction.BtF,
                 right_crossing_pull_direction: Pull_Direction = Pull_Direction.BtF,
                 cable_lean: Stitch_Lean = Stitch_Lean.Left):
        self._lean = cable_lean
        self._right_crossing_pull_direction = right_crossing_pull_direction
        self._left_crossing_pull_direction = left_crossing_pull_direction
        self._right_crossing_loops = right_crossing_loops
        self._left_crossing_loops = left_crossing_loops

    def __len__(self) -> int:
        return self._left_crossing_loops + self._right_crossing_loops

    @property
    def lean(self) -> Stitch_Lean:
        """
        :return: the direction the cable leans
        """
        return self._lean

    @property
    def left_crossing_depth(self) -> int:
        """
        :return: 1 if left loops cross in front, -1 otherwise
        """
        if self.lean is Stitch_Lean.Left:
            return 1
        else:
            return -1

    @property
    def right_crossing_depth(self) -> int:
        """
        :return: 1 if right loops cross in front, -1 otherwise
        """
        return -1 * self.left_crossing_depth

    def stitch_definitions(self) -> List[Stitch_Definition]:
        """
        :return: the list of stitch definitions that construct this cable in yarn-wise order
        """
        crossing_offset_direction = self.lean.offset_direction()
        if self.lean is Stitch_Lean.Left:
            crossing_pull_direction = self._left_crossing_pull_direction
            crossing_offset_magnitude = self._right_crossing_loops
            stable_pull_direction = self._right_crossing_pull_direction
            stable_offset_magnitude = self._left_crossing_loops
        else:
            crossing_pull_direction = self._right_crossing_pull_direction
            crossing_offset_magnitude = self._left_crossing_loops
            stable_pull_direction = self._left_crossing_pull_direction
            stable_offset_magnitude = self._right_crossing_loops
        crossings = [Stitch_Definition(crossing_pull_direction, 1, [crossing_offset_direction * crossing_offset_magnitude])
                     for _ in range(0, stable_offset_magnitude)]
        stable = [Stitch_Definition(stable_pull_direction, -1, [-1 * crossing_offset_direction * stable_offset_magnitude])
                  for _ in range(0, crossing_offset_magnitude)]
        if self.lean is Stitch_Lean.Left:
            return stable + crossings
        else:
            return crossings + stable

    def copy(self):
        """
        :return: a deep copy of the cable definition
        """
        newCable = Cable_Definition(self._left_crossing_loops, self._right_crossing_loops,
                                    self._left_crossing_pull_direction, self._right_crossing_pull_direction, self.lean)
        return newCable

    def copy_and_flip(self):
        """
        :return: a deep copy of stitch that is flipped
        """
        return Cable_Definition(self._right_crossing_loops, self._left_crossing_loops,
                                self._right_crossing_pull_direction, self._left_crossing_pull_direction,
                                self.lean.flip())

    def __str__(self):
        return f"C{self.lean}({self._left_crossing_loops}-{self._left_crossing_pull_direction}/{self._right_crossing_loops}-{self._right_crossing_pull_direction}"

    def __repr__(self):
        return str(self)
