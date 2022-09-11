"""Script used to create knitout instructions from a knitgraph"""
from typing import Dict, List, Tuple, Optional

from ..knit_graphs.Knit_Graph import Knit_Graph, Pull_Direction
from .Machine_State import Machine_State, Needle, Pass_Direction
from .machine_operations import outhook
from .operation_sets import Carriage_Pass, Instruction_Type


class Knitout_Generator:
    """
    A class that is used to generate a single yarn knit-graph
    """

    def __init__(self, knit_graph: Knit_Graph):
        """
        :param knit_graph: the knitgraph to generate instructions for
        """
        self._knit_graph = knit_graph
        assert len(self._knit_graph.yarns) == 1, "This only supports single color graphs"
        self._carrier = [*self._knit_graph.yarns.values()][0].carrier
        loop_id_to_course, courses_to_loop_ids = self._knit_graph.get_courses()
        self._loop_id_to_courses: Dict[int, float] = loop_id_to_course
        self._courses_to_loop_ids: Dict[float, List[int]] = courses_to_loop_ids
        self._sorted_courses = sorted([*self._courses_to_loop_ids.keys()])
        self._machine_state: Machine_State = Machine_State()
        self._carriage_passes: List[Carriage_Pass] = []
        self._instructions: List[str] = []

    def generate_instructions(self):
        """
        Generates the instructions for this knitgraph
        """
        self._add_header()
        self._cast_on()
        assert self._machine_state.last_carriage_direction is Pass_Direction.Left_to_Right
        pass_direction = self._machine_state.last_carriage_direction.opposite()
        for course in self._sorted_courses:
            if course > 0:  # not cast on
                course_loops = self._courses_to_loop_ids[course]
                self._knit_row(course_loops, pass_direction, course)
                pass_direction = pass_direction.opposite()
        self._instructions.append(outhook(self._machine_state, [self._carrier]))
        self._drop_loops()

    def _drop_loops(self):
        """
        Drops all loops off the machine
        """
        drops: Dict[Needle, Tuple[None, None]] = {}
        second_drops: Dict[Needle, Tuple[None, None]] = {}
        for needle_pos in range(0, self._machine_state.needle_count):
            front_needle = Needle(is_front=True, position=needle_pos)
            back_needle = Needle(is_front=False, position=needle_pos)
            dropped_front = False
            if len(self._machine_state[front_needle]) > 0:  # drop on loops on front
                drops[front_needle] = None, None
                dropped_front = True
            if len(self._machine_state[back_needle]) > 0:
                if dropped_front:
                    second_drops[back_needle] = None, None
                else:
                    drops[back_needle] = None, None
        carriage_pass = Carriage_Pass(Instruction_Type.Drop, None, drops, [], self._machine_state)
        self._add_carriage_pass(carriage_pass, "Drop KnitGraph")
        carriage_pass = Carriage_Pass(Instruction_Type.Drop, None, second_drops, [], self._machine_state)
        self._add_carriage_pass(carriage_pass)

    def _cast_on(self):
        """
        Does a standard alternating tuck cast on then 2 stabilizing knit rows
        """
        first_course_loops = self._courses_to_loop_ids[self._sorted_courses[0]]
        carrier_set = [self._carrier]
        even_tucks_data: Dict[Needle, Tuple[Optional[int], None]] = {}
        odd_tucks_data: Dict[Needle, Tuple[Optional[int], None]] = {}
        for needle_pos in range(0, len(first_course_loops)):
            if needle_pos % 2 == 0:
                even_tucks_data[Needle(True, needle_pos)] = -1, None  # note, fake loop_id
            else:
                odd_tucks_data[Needle(True, needle_pos)] = -1, None

        even_pass = Carriage_Pass(Instruction_Type.Tuck, Pass_Direction.Right_to_Left, even_tucks_data,
                                  carrier_set, self._machine_state)
        self._add_carriage_pass(even_pass, "even cast-on")
        odd_pass = Carriage_Pass(Instruction_Type.Tuck, Pass_Direction.Left_to_Right, odd_tucks_data,
                                 carrier_set, self._machine_state)
        self._add_carriage_pass(odd_pass, "odd cast-on")

        reverse_knits: Dict[Needle, Tuple[int, None]] = {}
        first_loops: Dict[Needle, Tuple[int, None]] = {}
        for needle_pos, loop_id in enumerate(first_course_loops):
            reverse_knits[Needle(True, needle_pos)] = -1, None  # note, fake loop_id
            first_loops[Needle(True, needle_pos)] = loop_id, None

        carriage_pass = Carriage_Pass(Instruction_Type.Knit, Pass_Direction.Right_to_Left,
                                      reverse_knits, carrier_set, self._machine_state)
        self._add_carriage_pass(carriage_pass, "stabilize cast-on")
        carriage_pass = Carriage_Pass(Instruction_Type.Knit, Pass_Direction.Left_to_Right,
                                      first_loops, carrier_set, self._machine_state)
        self._add_carriage_pass(carriage_pass, "first row loops")

    def _knit_row(self, loop_ids: List[int], direction: Pass_Direction, course_number: int):
        """
        Adds the knit instructions for the given loop ids.
        Transfers to make these loops are also executed
        :param loop_ids: the loop ids of a single course
        :param direction: the direction that the loops will be knit in
        :param course_number: the course identifier for comments only
        """
        carrier_set = [self._carrier]
        loop_id_to_target_needle = self._do_xfers_for_row(loop_ids, direction)
        knit_data: Dict[Needle, Tuple[int, None]] = {}
        for loop_id, target_needle in loop_id_to_target_needle.items():
            knit_data[target_needle] = loop_id, None
        carriage_pass = Carriage_Pass(Instruction_Type.Knit, direction, knit_data, carrier_set, self._machine_state)
        self._add_carriage_pass(carriage_pass, f"Knit course {course_number}")

    def _do_xfers_for_row(self, loop_ids: List[int], direction: Pass_Direction) -> Dict[int, Needle]:
        """
        Completes all the xfers needed to prepare a row
        :param loop_ids: the loop ids of a single course
        :param direction: the direction that the loops will be knit in
        :return:
        """
        loop_id_to_target_needle, parent_loops_to_needles, lace_offsets, front_cable_offsets, back_cable_offsets \
            = self._find_target_needles(loop_ids, direction)
        self._do_decrease_transfers(parent_loops_to_needles, lace_offsets)
        self._do_cable_transfers(parent_loops_to_needles, front_cable_offsets, back_cable_offsets)
        self._do_knit_purl_xfers(loop_id_to_target_needle)
        return loop_id_to_target_needle

    def _find_target_needles(self, loop_ids: List[int], direction: Pass_Direction) -> \
            Tuple[Dict[int, Needle], Dict[int, Needle], Dict[int, int], Dict[int, int], Dict[int, int]]:
        """
        Finds target needle information needed to do transfers
        :param loop_ids: the loop ids of a single course
        :param direction: the direction that the loops will be knit in
        :return: Loops mapped to target needles to be knit on,
        parent loops mapped to current needles,
        parent loops mapped to their offsets in a decrease
        parent loops mapped to their offsets in the front of cables
        parent loops mapped to their offsets in the back of cables
        """
        parent_loops_to_needles: Dict[int, Needle] = {}  # key loop_ids to the needle they are currently on
        loop_id_to_target_needle: Dict[int, Needle] = {}  # key loop_ids to the needle they need to be on to knit
        parents_to_offsets: Dict[int, int] = {}  # key parent loop_ids to their offset from their child
        # .... i.e., self._knit_graph.graph[parent_id][loop_id]["parent_offset"]
        front_cable_offsets: Dict[int, int] = {}  # key parent loop_id to the offset to their child
        # .... only include loops that cross in front. i.e., self._knit_graph.graph[parent_id][loop_id]["depth"] > 0
        back_cable_offsets: Dict[int, int] = {}  # key parent loop_id to the offset to their child
        # .... only include loops that cross in back. i.e., self._knit_graph.graph[parent_id][loop_id]["depth"] < 0
        decrease_offsets: Dict[int, int] = {}  # key parent loop_id to the offset to their chidl
        # .... only includes parents involved in a decrease
        max_needle = len(loop_ids) - 1  # last needle being used to create this swatch
        for loop_pos, loop_id in enumerate(loop_ids):  # find target needle locations of each loop in the course
            parent_ids = [*self._knit_graph.graph.predecessors(loop_id)]
            for parent_id in parent_ids:  # find current needle of all parent loops
                parent_needle = self._machine_state.get_needle_of_loop(parent_id)
                assert parent_needle is not None, f"Parent loop {parent_id} is not held on a needle"
                parent_loops_to_needles[parent_id] = parent_needle
            if len(parent_ids) == 0:  # yarn-over, yarn overs are made on front bed
                if direction is Pass_Direction.Left_to_Right:
                    position = loop_pos
                else:
                    position = max_needle - loop_pos
                loop_id_to_target_needle[loop_id] = Needle(is_front=True, position=position)
            elif len(parent_ids) == 1:  # knit, purl, may be in cable, no needle
                parent_id = [*parent_ids][0]
                parent_offset = self._knit_graph.graph[parent_id][loop_id]["parent_offset"]
                if parent_offset != 0:
                    cable_depth = self._knit_graph.graph[parent_id][loop_id]["depth"]
                    assert cable_depth != 0, f"cables must have a non-zero depth to cross at"
                    if cable_depth == 1:
                        front_cable_offsets[parent_id] = parent_offset
                    else:
                        back_cable_offsets[parent_id] = parent_offset
                pull_direction = self._knit_graph.graph[parent_id][loop_id]["pull_direction"]
                front_bed = pull_direction is Pull_Direction.BtF  # knit on front bed, purl on back bed
                parent_needle = parent_loops_to_needles[parent_id]
                offset_needle = parent_needle.offset(parent_offset)
                target_needle = Needle(is_front=front_bed, position=offset_needle.position)
                loop_id_to_target_needle[loop_id] = target_needle
                parents_to_offsets[parent_id] = parent_offset
            else:  # decrease, the bottom parent loop in the stack  will be on the target needle
                loop = self._knit_graph.loops[loop_id]
                target_needle = None # re-assigned on first iteration to needle of first parent
                for i, parent in enumerate(loop.parent_loops):
                    parent_needle = parent_loops_to_needles[parent.loop_id]
                    if i == 0:  # first parent in stack
                        target_needle = parent_needle
                    loop_id_to_target_needle[loop_id] = target_needle
                    offset = self._knit_graph.graph[parent.loop_id][loop_id]["parent_offset"]
                    # offset = target_needle.position - parent_needle.position # todo reknit to check this is right
                    parents_to_offsets[parent.loop_id] = offset
                    decrease_offsets[parent.loop_id] = offset

        return loop_id_to_target_needle, parent_loops_to_needles, decrease_offsets, \
               front_cable_offsets, back_cable_offsets

    def _do_cable_transfers(self, parent_loops_to_needles: Dict[int, Needle], front_cable_offsets: Dict[int, int],
                            back_cable_offsets: Dict[int, int]):
        """
        Transfer all parent loops to back bed
        For front_cables:
            in order of offsets (i.e., 1, 2, 3) transfer to front
        for back_cables
            in order of offsets transfer to back
        :param parent_loops_to_needles: the parent loops mapped to their current needles
        :param front_cable_offsets: parent loops mapped to their offsets for the front of cables
        :param back_cable_offsets: parent loops mapped to their offsets for the back of cables
        """
        xfers_to_back: Dict[Needle, Tuple[None, Needle]] = {}
        front_cable_xfers: Dict[int, Dict[Needle, Tuple[None, Needle]]] = {}
        back_cable_xfers: Dict[int, Dict[Needle, Tuple[None, Needle]]] = {}
        for parent_loop, parent_needle in parent_loops_to_needles.items():
            front_needle = Needle(is_front=True, position=parent_needle.position)
            back_needle = parent_needle.opposite()
            if parent_needle.is_front and (parent_loop in front_cable_offsets or parent_loop in back_cable_offsets):
                xfers_to_back[front_needle] = None, back_needle
            if parent_loop in front_cable_offsets:
                offset = front_cable_offsets[parent_loop]
                if offset not in front_cable_xfers:
                    front_cable_xfers[offset] = {}
                offset_needle = front_needle.offset(offset)
                front_cable_xfers[offset][back_needle] = None, offset_needle
            elif parent_loop in back_cable_offsets:
                offset = back_cable_offsets[parent_loop]
                if offset not in back_cable_xfers:
                    back_cable_xfers[offset] = {}
                offset_needle = front_needle.offset(offset)
                back_cable_xfers[offset][back_needle] = None, offset_needle
        carriage_pass = Carriage_Pass(Instruction_Type.Xfer, None, xfers_to_back, [], self._machine_state)
        self._add_carriage_pass(carriage_pass, "cables to back")
        for offset, xfer_params in front_cable_xfers.items():
            carriage_pass = Carriage_Pass(Instruction_Type.Xfer, None, xfer_params, [], self._machine_state)
            self._add_carriage_pass(carriage_pass, f"front of cable at offset {offset} to front")
        for offset, xfer_params in back_cable_xfers.items():
            carriage_pass = Carriage_Pass(Instruction_Type.Xfer, None, xfer_params, [], self._machine_state)
            self._add_carriage_pass(carriage_pass, f"back of cable at offset {offset} to front")

    def _do_decrease_transfers(self, parent_loops_to_needles: Dict[int, Needle], decrease_offsets: Dict[int, int]):
        """
        Based on the schoolbus algorithm.
         Transfer all loops in decrease to the opposite side
         Bring the loops back to their offset needle in the order of offsets from negative to positive offsets
        Note that we are restricting our decreases to be offsets of 1 or -1 due to limitations of the machine.
        This is not a completely general method and does not garuntee stacking order of our decreases
        A more advanced method can be found at:
        https://textiles-lab.github.io/posts/2018/02/07/lace-transfers/
        This would requre some changes to the code structure and is not reccomended for assignment 2.
        :param parent_loops_to_needles: parent loops mapped to their current needle
        :param decrease_offsets: the offsets of parent loops to create decreases
        """
        xfers_to_holding_bed: Dict[Needle, Tuple[None, Needle]] = {}
        # key needles currently holding the loops to the opposite needle to hold them for offset-xfers
        offset_to_xfers_to_target: Dict[int, Dict[Needle, Tuple[None, Needle]]] = {}
        # key offset values (-N...0..N) to starting needles to their target needle
        for parent_id, parent_needle in parent_loops_to_needles.items():
            if parent_id in decrease_offsets:  # this loop is involved in a decrease
                offset = decrease_offsets[parent_id]
                offset_needle = parent_needle.offset(offset)
                holding_needle = parent_needle.opposite()
                xfers_to_holding_bed[parent_needle] = (None, holding_needle)
                if offset not in offset_to_xfers_to_target:
                    offset_to_xfers_to_target[offset] = {}
                offset_to_xfers_to_target[offset][holding_needle] = (None, offset_needle)

        carriage_pass = Carriage_Pass(Instruction_Type.Xfer, None, xfers_to_holding_bed, [], self._machine_state)
        self._add_carriage_pass(carriage_pass, "send loops to decrease to back")
        for offset in sorted(offset_to_xfers_to_target.keys()):
            offset_xfers = offset_to_xfers_to_target[offset]
            carriage_pass = Carriage_Pass(Instruction_Type.Xfer, None, offset_xfers, [], self._machine_state)
            self._add_carriage_pass(carriage_pass, f"stack decreases with offset {offset}")

    def _do_knit_purl_xfers(self, loop_id_to_target_needle: Dict[int, Needle]):
        """
        Transfers loops to bed needed for knit vs purl
        :param loop_id_to_target_needle: loops mapped to their target needles
        """
        xfers: Dict[Needle, Tuple[None, Needle]] = {}
        for loop_id, target_needle in loop_id_to_target_needle.items():
            opposite_needle = target_needle.opposite()
            loops_on_opposite = self._machine_state[opposite_needle]
            if len(loops_on_opposite) > 0:  # something to transfer for knitting
                xfers[opposite_needle] = None, target_needle
        carriage_pass = Carriage_Pass(Instruction_Type.Xfer, None, xfers, [], self._machine_state)
        self._add_carriage_pass(carriage_pass, "kp-transfers")

    def _add_carriage_pass(self, carriage_pass: Carriage_Pass, first_comment="", comment=""):
        """
        Executes the carriage pass and adds it to the instructions
        :param carriage_pass: the carriage pass to be executed
        :param first_comment: a comment for the first instruction
        :param comment:  a comment for each instruction
        """
        if len(carriage_pass.needles_to_instruction_parameters) > 0:
            self._carriage_passes.append(carriage_pass)
            self._instructions.extend(carriage_pass.write_instructions(first_comment, comment))

    def write_instructions(self, filename: str, generate_instructions: bool = True):
        """
        Writes the instructions from the generator to a knitout file
        :param filename: the name of the file including the suffix
        :param generate_instructions: True if the instructions still need to be generated
        """
        if generate_instructions:
            self.generate_instructions()
        with open(filename, "w") as file:
            file.writelines(self._instructions)

    def _add_header(self, position: str = "Center"):
        """
        Writes the header instructions for this knitgraph
        :param position: where to place the operations on the needle bed; Left, Center, Right,
         and Keep are standard values
        """
        self._instructions.extend([";!knitout-2\n",
                                   ";;Machine: SWG091N2\n",
                                   ";;Gauge: 5\n",
                                   ";;Width: 250\n",
                                   f";;Carriers: 1 2 3 4 5 6 7 8 9 10\n",
                                   f";;Position: {position}\n"])
