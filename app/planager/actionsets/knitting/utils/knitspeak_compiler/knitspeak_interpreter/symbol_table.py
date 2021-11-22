"""Symbol Table structure holds definitions of stitches and context for number variables"""
from typing import Dict, Union

from ...knit_graphs.Knit_Graph import Pull_Direction
from .cable_definitions import Cable_Definition
from .stitch_definitions import Stitch_Definition, Stitch_Lean


class Symbol_Table:
    """
    A class used to keep track of how stitches and number variables have been defined. Includes language defaults
    """

    def __init__(self):
        self._symbol_table: Dict[str, Union[Cable_Definition, Stitch_Definition, int]] = {"k": self._knit(), "p": self._purl(),
                                                                                          "yo": self._yo(), "slip": self._slip()}
        self._decreases()
        self._cables()
        # set current row variable
        self._symbol_table["current_row"] = 0

    def _cables(self):
        #  (i.e., self._symbol_table[{cable_name}] = Cable_Definition(...))
        #  for every combination of right and left loop counts create cables that:
        #   lean left, lean right, lean left and purl, lean right and purl,
        #  e.g. for 1 left stitch and 2 right stitches you will have:
        #   LC1|2, LC1P|2, LC1|2P, LC1P|2P, RC1|2, RC1P|2, RC1|2P, RC1P|2P
        #  each group of loops can have 1, 2, or 3 loops

        for num_left in [1,2,3]:
            for num_right in [1,2,3]:
                for left_purl in ["p",""]:
                    for right_purl in ["p",""]:
                        for crossing in ["l","r"]:
                            stitch = f"{crossing}c{num_left}{left_purl}|{num_right}{right_purl}"
                            self[stitch] = Cable_Definition(
                                left_crossing_loops=num_left,
                                right_crossing_loops=num_right,
                                left_crossing_pull_direction=Pull_Direction.FtB if (left_purl=="p") else Pull_Direction.BtF,
                                right_crossing_pull_direction=Pull_Direction.FtB if (right_purl=="p") else Pull_Direction.BtF,
                                cable_lean=Stitch_Lean.Left if crossing=="l" else Stitch_Lean.Right,
                            )


    def _decreases(self):
        #  (i.e., self[{stitch_name}] = Stitch_Definition(...))
        #  You need to implement the following stitches: k2tog,k3tog, p2tog, p3tog,
        #   skpo,sppo (purl version of skpo), s2kpo, s2ppo, sk2po, sp2po

        self["k2tog"] = Stitch_Definition(
                pull_direction=Pull_Direction.BtF,
                cabling_depth=0,
                offset_to_parent_loops=[-1, 0],
                child_loops=1
            )

        self["k3tog"] = Stitch_Definition(
                pull_direction=Pull_Direction.BtF,
                cabling_depth=0,
                offset_to_parent_loops=[-2, -1, 0],
                child_loops=1
            )

        self["p2tog"] = Stitch_Definition(
                pull_direction=Pull_Direction.FtB,
                cabling_depth=0,
                offset_to_parent_loops=[-1, 0],
                child_loops=1
            )

        self["p3tog"] = Stitch_Definition(
                pull_direction=Pull_Direction.FtB,
                cabling_depth=0,
                offset_to_parent_loops=[-2, -1, 0],
                child_loops=1
            )

        self["skpo"] = Stitch_Definition(
                pull_direction=Pull_Direction.BtF,
                cabling_depth=0,
                offset_to_parent_loops=[0, 1],
                child_loops=1
            )

        self["sppo"] = Stitch_Definition(
                pull_direction=Pull_Direction.FtB,
                cabling_depth=0,
                offset_to_parent_loops=[0, 1],
                child_loops=1
            )

        self["s2kpo"] = Stitch_Definition(
                pull_direction=Pull_Direction.BtF,
                cabling_depth=0,
                offset_to_parent_loops=[2, 1, 0],
                child_loops=1
            )

        self["s2ppo"] = Stitch_Definition(
                pull_direction=Pull_Direction.FtB,
                cabling_depth=0,
                offset_to_parent_loops=[2, 1, 0],
                child_loops=1
            )

        self["sk2po"] = Stitch_Definition(
                pull_direction=Pull_Direction.BtF,
                cabling_depth=0,
                offset_to_parent_loops=[-1, 0, 1],
                child_loops=1
            )

        self["sp2po"] = Stitch_Definition(
                pull_direction=Pull_Direction.FtB,
                cabling_depth=0,
                offset_to_parent_loops=[-1, 0, 1],
                child_loops=1
            )



    @staticmethod
    def _slip() -> Stitch_Definition:
        return Stitch_Definition(pull_direction=Pull_Direction.BtF, cabling_depth=0, offset_to_parent_loops=None, child_loops=0)

    @staticmethod
    def _yo() -> Stitch_Definition:
        return Stitch_Definition(pull_direction=Pull_Direction.BtF, cabling_depth=0, offset_to_parent_loops=[], child_loops=1)

    @staticmethod
    def _purl() -> Stitch_Definition:
        return Stitch_Definition(pull_direction=Pull_Direction.FtB, cabling_depth=0, offset_to_parent_loops=None, child_loops=1)

    @staticmethod
    def _knit() -> Stitch_Definition:
        return Stitch_Definition(pull_direction=Pull_Direction.BtF, cabling_depth=0, offset_to_parent_loops=None, child_loops=1)


    def __contains__(self, item: str):
        return item.lower() in self._symbol_table

    def __setitem__(self, key: str, value: Union[int, Stitch_Definition, Cable_Definition]):
        self._symbol_table[key.lower()] = value

    def __getitem__(self, item: str):
        return self._symbol_table[item.lower()]
