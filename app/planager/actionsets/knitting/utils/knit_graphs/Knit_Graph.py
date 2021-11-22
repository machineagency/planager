"""The graph structure used to represent knitted objects"""
from enum import Enum
from typing import Dict, Optional, List, Tuple

import networkx
from .Loop import Loop
from .Yarn import Yarn
from ..knitting_machine.Machine_State import Yarn_Carrier

class Pull_Direction(Enum):
    """An enumerator of the two pull directions of a loop"""
    BtF = "BtF"
    FtB = "FtB"

    def opposite(self):
        """
        :return: returns the opposite pull direction of self
        """
        if self is Pull_Direction.BtF:
            return Pull_Direction.FtB
        else:
            return Pull_Direction.BtF


class Knit_Graph:
    """
    A class to knitted structures
    ...

    Attributes
    ----------
    graph : networkx.DiGraph
        the directed-graph structure of loops pulled through other loops
    loops: Dict[int, Loop]
        A map of each unique loop id to its loop
    yarns: Dict[str, Yarn]
         A list of Yarns used in the graph
    """

    def __init__(self):
        self.graph: networkx.DiGraph = networkx.DiGraph()
        self.loops: Dict[int, Loop] = {}
        self.last_loop_id: int = -1
        self.yarns: Dict[str, Yarn] = {}

    def add_loop(self, loop: Loop):
        """
        :param loop: the loop to be added in as a node in the graph
        """
        self.graph.add_node(loop.loop_id, loop=loop)
        assert loop.yarn_id in self.yarns, f"No yarn {loop.yarn_id} in this graph"
        if loop not in self.yarns[loop.yarn_id]:  # make sure the loop is on the yarn specified
            self.yarns[loop.yarn_id].add_loop_to_end(loop_id=None, loop=loop)
        self.loops[loop.loop_id] = loop

    def add_yarn(self, yarn: Yarn):
        """
        :param yarn: the yarn to be added to the graph structure
        """
        self.yarns[yarn.yarn_id] = yarn

    def connect_loops(self, parent_loop_id: int, child_loop_id: int,
                      pull_direction: Pull_Direction = Pull_Direction.BtF,
                      stack_position: Optional[int] = None, depth: int = 0, parent_offset: int = 0):
        """
        Creates a stitch-edge by connecting a parent and child loop
        :param parent_offset: The direction and distance, oriented from the front, to the parent_loop
        :param depth: -1, 0, 1: The crossing depth in a cable over other stitches. 0 if Not crossing other stitches
        :param parent_loop_id: the id of the parent loop to connect to this child
        :param child_loop_id:  the id of the child loop to connect to the parent
        :param pull_direction: the direction the child is pulled through the parent
        :param stack_position: The position to insert the parent into, by default add on top of the stack
        """
        assert parent_loop_id in self, f"parent loop {parent_loop_id} is not in this graph"
        assert child_loop_id in self, f"child loop {child_loop_id} is not in this graph"
        self.graph.add_edge(parent_loop_id, child_loop_id, pull_direction=pull_direction, depth=depth, parent_offset=parent_offset)
        # TODO: Check that the order of edges (parent -> child) is correct in your code
        child_loop = self[child_loop_id]
        parent_loop = self[parent_loop_id]
        child_loop.add_parent_loop(parent_loop, stack_position)

    def get_courses(self) -> Tuple[Dict[int, int], Dict[int, List[int]]]:
        """
        :return: A dictionary of loop_ids to the course they are on,
        a dictionary or course ids to the loops on that course in the order of creation
        The first set of loops in the graph is on course 0.
        A course change occurs when a loop has a parent loop that is in the last course.
        """
        loop_ids_to_course = {}
        course_to_loop_ids = {}
        current_course_set = set()
        current_course = []
        course = 0
        for loop_id in self.graph.nodes:
            no_parents_in_course = True
            for parent_id in self.graph.predecessors(loop_id):
                if parent_id in current_course_set:
                    no_parents_in_course = False
                    break
            if no_parents_in_course:
                current_course_set.add(loop_id)
                current_course.append(loop_id)
            else:
                course_to_loop_ids[course] = current_course
                current_course = [loop_id]
                current_course_set = {loop_id}
                course += 1
            loop_ids_to_course[loop_id] = course
        course_to_loop_ids[course] = current_course
        return loop_ids_to_course, course_to_loop_ids

    # @deprecated("Deprecated because this only works in rows, but not round construction")
    def deprecated_get_course(self) -> Tuple[Dict[int, int], Dict[int, List[int]]]:
        """
        :return: A dictionary of loop_ids to the course they are on,
        a dictionary or course ids to the loops on that course in the order of creation
        The first set of loops in the graph is on course 0.
        A course change occurs when a loop has a parent loop that is in the last course.
        """
        loop_ids_to_course = {}
        for loop_id in self.graph.nodes:
            loop = self.loops[loop_id]
            prior_id = loop.prior_loop_id(self)
            if prior_id is None:  # the first loop in the graph
                loop_ids_to_course[loop_id] = 0
            elif self.graph.has_edge(prior_id, loop_id):  # stitch between the two creates a course change
                loop_ids_to_course[loop_id] = loop_ids_to_course[prior_id] + 1
            else:
                loop_ids_to_course[loop_id] = loop_ids_to_course[prior_id]

        course_to_loop_ids = {}
        for loop_id, course in loop_ids_to_course.items():
            if course not in course_to_loop_ids:
                course_to_loop_ids[course] = []
            course_to_loop_ids[course].append(loop_id)

        for course in course_to_loop_ids:
            course_to_loop_ids[course].sort()
        return loop_ids_to_course, course_to_loop_ids

    def get_carriers(self) -> List[Yarn_Carrier]:
        """
        :return: A list of yarn carriers that hold the yarns involved in this graph
        """
        return [yarn.carrier for yarn in self.yarns.values()]

    def __contains__(self, item):
        """
        :param item: the loop being checked for in the graph
        :return: true if the loop_id of item or the loop is in the graph
        """
        if type(item) is int:
            return self.graph.has_node(item)
        elif isinstance(item, Loop):
            return self.graph.has_node(item.loop_id)
        else:
            return False

    def __getitem__(self, item: int) -> Loop:
        """
        :param item: the loop_id being checked for in the graph
        :return: the Loop in the graph with the matching id
        """
        if item not in self:
            raise AttributeError
        else:
            return self.graph.nodes[item]["loop"]
