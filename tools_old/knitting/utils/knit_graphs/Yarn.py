"""
The Yarn Data Structure
"""
from typing import Optional, Tuple

import networkx as networkx

from ..knit_graphs.Loop import Loop
from ..knitting_machine.Machine_State import Yarn_Carrier


class Yarn:
    """
    A class to represent a yarn structure
    ...

    Attributes
    ----------
    yarn_graph: networkx.DiGraph
        A directed graph structure (always a list) of loops on the yarn
    last_loop_id: int
        The id of the last loop on the yarn, none if no loops on the yarn
    """

    def __init__(self, yarn_id: str, knit_graph, last_loop: Optional[Loop] = None, carrier_id: int = 3):
        """
        A Graph structure to show the yarn-wise relationship between loops
        :param knit_graph: The knitgraph the yarn is used in
        :param yarn_id: the identifier for this loop
        :param last_loop: the loop to add onto this yarn at the beginning. May be none if yarn is empty.
        """
        self.knit_graph = knit_graph
        assert 0 < carrier_id < 11, f"Invalid yarn carrier {carrier_id}"
        self._carrier: Yarn_Carrier = Yarn_Carrier(carrier_id)
        self.yarn_graph: networkx.DiGraph = networkx.DiGraph()
        if last_loop is None:
            self.last_loop_id = None
        else:
            self.last_loop_id: int = last_loop.loop_id
        self._yarn_id: str = yarn_id

    @property
    def carrier(self) -> Yarn_Carrier:
        """
        :return: the yarn-carrier holding this yarn
        """
        return self._carrier

    @property
    def yarn_id(self) -> str:
        """
        :return: the id of this yarn
        """
        return self._yarn_id

    def add_loop_to_end(self, loop_id: int = None, loop: Optional[Loop] = None,
                        is_twisted: bool = False) -> Tuple[int, Loop]:
        """
        Adds the loop at the end of the yarn
        :param is_twisted: The parameter used for twisting the loop if it is created in the method
        :param loop: The loop to be added at this id. If none, an non-twisted loop will be created
        :param loop_id: the id of the new loop, if the loopId is none, it defaults to 1 more than last loop in the graph
        :return: the loop_id added to the yarn, the loop added to the yarn
        """
        if loop_id is None:  # Create a new Loop ID
            if loop is not None:  # get the loop id from the provided loop
                assert self.last_loop_id > loop.loop_id, \
                    f"Cannot add loop {loop.loop_id} after loop {self.last_loop_id}."
                loop_id = loop.loop_id
            elif self.last_loop_id is None:  # the first loop on the yarn
                loop_id = 0
            else:  # the next loop on this yarn
                loop_id = self.knit_graph.last_loop_id + 1
        if loop is None:  # create a loop from default information
            loop = Loop(loop_id, self.yarn_id, is_twisted)
        self.yarn_graph.add_node(loop_id, loop=loop)
        if self.last_loop_id is not None:  # make a link between this and the last yarn
            self.yarn_graph.add_edge(self.last_loop_id, loop_id)
        self.last_loop_id = loop_id
        self.knit_graph.last_loop_id = loop_id
        return loop_id, loop

    def __contains__(self, item):
        """
        :param item: the loop being checked for in the yarn
        :return: true if the loop_id of item or the loop is in the yarn
        """
        if type(item) is int:
            return self.yarn_graph.has_node(item)
        elif isinstance(item, Loop):
            return self.yarn_graph.has_node(item.loop_id)
        else:
            return False

    def __getitem__(self, item: int) -> Loop:
        """
        :param item: the loop_id being checked for in the yarn
        :return: the Loop on the yarn with the matching id
        """
        if item not in self:
            raise AttributeError
        else:
            return self.yarn_graph.nodes[item].loop
