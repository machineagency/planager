"""The class structures used to maintain the machine state"""
from enum import Enum
from typing import Optional, List, Tuple, Dict, Union, Set


class Pass_Direction(Enum):
    """
    An enumerator for the two directions the carriage can pass on the machine
    Needles are oriented on the machine left to right in ascending order:
    Left -> 0 1 2 ... N <- Right
    """
    Right_to_Left = "-"
    Left_to_Right = "+"

    def opposite(self):
        """
        :return: the opposite pass direction of this
        """
        if self.value == Pass_Direction.Right_to_Left.value:
            return Pass_Direction.Left_to_Right
        else:
            return Pass_Direction.Right_to_Left

    def next_needle_position(self, needle_pos: int):
        """
        :param needle_pos: the needle that we are looking for the next neighbor of
        :return: the next needle position in the pass direction
        """
        if self.value == Pass_Direction.Right_to_Left.value:
            return needle_pos - 1
        else:
            return needle_pos + 1

    def prior_needle_position(self, needle_pos: int):
        """
        :param needle_pos: the needle that we are looking for the prior neighbor of
        :return: the prior needle position in the pass direction
        """
        if self.value == Pass_Direction.Right_to_Left.value:
            return needle_pos + 1
        else:
            return needle_pos - 1

    def __str__(self):
        return self.value


class Needle:
    """
    A Simple class structure for keeping track of needle locations
    """

    def __init__(self, is_front: bool, position: int):
        """
        :param is_front: True if front bed needle, False otherwise
        :param position: the needle index of this needle
        """
        self.is_front: bool = is_front
        self.position: int = position
        assert self.position is not None

    def opposite(self):
        """
        :return: the needle on the opposite bed at the same position
        """
        return Needle(is_front=not self.is_front, position=self.position)

    def offset(self, offset:int):
        """
        :param offset: the amount to offset the needle from
        :return: the needle offset spaces away on the same bed
        """
        return Needle(is_front=self.is_front, position=self.position + offset)

    def __str__(self):
        if self.is_front:
            return f"f{self.position + 1}"
        else:
            return f"b{self.position + 1}"

    def __repr__(self):
        return str(self)

    def __hash__(self):
        return self.position

    def __lt__(self, other):
        if isinstance(other, Needle):
            return self.position < other.position
        elif type(other) is int:
            return self.position < other
        else:
            raise AttributeError


class Machine_Bed:
    """
    A structure to hold information about loops held on one bed of needles...

    Attributes
    ----------
    held_loops : Dict[int, List[int]
        a dictionary keyed by needle positions to the stack of loops on the needle
    loops_to_needle: Dict[int, Optional[int]]
        A dictionary keyed by loop ids to the needle location that this loop is currently held at.
         If it is not held this is None or non-existant
    """

    def __init__(self, is_front: bool, needle_count: int = 250):
        """
        A representation of the state of a bed on the machine
        :param is_front: True if this is the front bed, false if it is the back bed
        :param needle_count: the number of needles that are on this bed
        """
        self._is_front: bool = is_front
        self._needle_count: int = needle_count
        self.held_loops: Dict[int, List[int]] = {i: [] for i in range(0, self.needle_count)}  # increasing indices indicate needles moving from left to right
        # i.e., LEFT -> 0 1 2....N <- RIGHT of Machine
        self.loops_to_needle: Dict[int, Optional[int]] = {}

    @property
    def needle_count(self) -> int:
        """
        :return: the number of needles on the bed
        """
        return self._needle_count

    @property
    def is_front(self) -> bool:
        """
        :return: true if this is the front bed
        """
        return self._is_front

    def add_loop(self, loop_id: Optional[int], needle_position: int, drop_prior_loops: bool = True):
        """
        Puts the loop_id on given needle, overrides existing loops as if a knit operation took place
        :param drop_prior_loops: If true, any loops currently held on this needle are dropped
        :param loop_id: the loop_id to be held on the needle
        :param needle_position: the position of the needle
        """
        assert 0 <= needle_position < self.needle_count, f"Cannot place a loop at position {needle_position}"
        if drop_prior_loops:
            self.drop_loop(needle_position)
        self.held_loops[needle_position].append(loop_id)
        self.loops_to_needle[loop_id] = needle_position

    def drop_loop(self, needle_position: int):
        """
        Clears the loops held at this position as though a drop operation has been done
        :param needle_position:
        """
        assert 0 <= needle_position < self.needle_count, f"Cannot drop a loop at position {needle_position}"
        current_loops = self.held_loops[needle_position]
        self.held_loops[needle_position] = []
        for loop in current_loops:
            self.loops_to_needle[loop] = None

    def __getitem__(self, item: int) -> List[int]:
        """
        :param item: the needle position to get a loop from
        :return: the loop_id held at that position
        """
        return self.held_loops[item]

    def get_needle_of_loop(self, loop_id: int) -> Optional[int]:
        """
        :param loop_id: the loop being searched for
        :return: None if the bed does not hold the loop, otherwise the needle position that holds it
        """
        if loop_id not in self.loops_to_needle:
            return None
        return self.loops_to_needle[loop_id]


class Yarn_Carrier:
    """
    A structure to represent the location of a Yarn_carrier
    """

    def __init__(self, carrier_id: int = 3, position: int = -1):
        """
        Represents the state of the yarn_carriage
        :param position: the current needle position the carriage last stitched on
        :param carrier_id: The carrier_id for this yarn
        """
        assert 1 <= carrier_id <= 10, "Carriers must between 1 and 10"
        self._carrier_id: int = carrier_id
        self._position: int = position

    @property
    def position(self):
        """
        :return: The current needle position the carrier is sitting at
        """
        return self._position

    @property
    def carrier_id(self) -> int:
        """
        :return: the id of this carrier
        """
        return self._carrier_id

    def move_to_position(self, new_position: int):
        """
        Updates the structure as though the yarn carrier took a pass at the needle location
        :param new_position: the needle to move to
        """
        self._position = new_position

    def __str__(self):
        return str(self.carrier_id)

    def __hash__(self):
        return self.carrier_id


class Machine_State:
    """
    The current state of a whole V-bed knitting machine
    ...

    Attributes
    ----------
    racking: int
        The current racking of the machine: R = f-b
    front_bed: Machine_Bed
        The status of needles on the front bed
    back_bed: Machine_Bed
        The status of needles on the back bed
    last_carriage_direction: Pass_Direction
        the last direction the carriage took, used to infer the current position of the carriage (left or right)
    in_hooks: Set[Yarn_Carrier]
        The set of yarn carriers that are currently hooked on the machine and active
    yarns_in_operation: Set[Yarn_Carrier]
        The current yarns that being knit with and have not been cut, may also be hooked
    """

    def __init__(self, needle_count: int = 250, racking: int = 0):
        """
        Maintains the state of the machine
        :param needle_count:the number of needles that are on this bed
        :param racking:the current racking between the front and back bed: r=f-b
        """
        self.racking: int = racking
        self.front_bed: Machine_Bed = Machine_Bed(is_front=True, needle_count=needle_count)
        self.back_bed: Machine_Bed = Machine_Bed(is_front=False, needle_count=needle_count)
        self.last_carriage_direction: Pass_Direction = Pass_Direction.Left_to_Right
        # Presumes carriage is left on Right side before knitting
        self.in_hooks: Set[Yarn_Carrier] = set()
        self.yarns_in_operation: Set[Yarn_Carrier] = set()

    def in_hook(self, yarn_carrier: Yarn_Carrier):
        """
        Declares that the in_hook for this yarn carrier is in use
        :param yarn_carrier: the yarn_carrier to bring in
        """
        self.in_hooks.add(yarn_carrier)
        self.yarns_in_operation.add(yarn_carrier)

    def release_hook(self, yarn_carrier: Yarn_Carrier):
        """
        Declares that the in-hook is not in use but yarn remains in use
        :param yarn_carrier: the yarn carrier to remove the inhook off
        """
        self.in_hooks.remove(yarn_carrier)

    def out_hook(self, yarn_carrier: Yarn_Carrier):
        """
        Declares that the yarn is no longer in service, will need to be in-hooked to use
        :param yarn_carrier: the yarn carrier to remove from service
        """
        self.yarns_in_operation.remove(yarn_carrier)

    def switch_carriage_direction(self):
        """
        Switches the last carriage direction set
        """
        self.last_carriage_direction = self.last_carriage_direction.opposite()

    @property
    def needle_count(self) -> int:
        """
        :return: the number of needles on either bed of the machine
        """
        return self.front_bed.needle_count

    def add_loop(self, loop_id: int, needle_position: int, on_front: bool, carrier_set: List[Yarn_Carrier], drop_prior_loops: bool = True):
        """
        Puts the loop_id on given needle, overrides existing loops as if a knit operation took place
        :param carrier_set: the set  of yarns making this loop
        :param drop_prior_loops: If true, drops prior loops on the needle
        :param loop_id: the loop_id to be held on the needle
        :param needle_position: the position of the needle
        :param on_front: True if the loop is added to front bed, false if added to the back bed
        """
        for carrier in carrier_set:
            assert carrier in self.yarns_in_operation, f"{carrier} not in operation"
        if on_front:
            self.front_bed.add_loop(loop_id, needle_position, drop_prior_loops)
        else:
            self.back_bed.add_loop(loop_id, needle_position, drop_prior_loops)

    def drop_loop(self, needle_position: int, on_front: bool):
        """
        Clears the loops held at this position as though a drop operation has been done
        :param needle_position:
        :param on_front: True if the loop is dropped from the front bed, false if dropped on the back bed
        """
        if on_front:
            self.front_bed.drop_loop(needle_position)
        else:
            self.back_bed.drop_loop(needle_position)

    def xfer_loops(self, starting_pos: int, ending_pos: int, front_to_back: bool):
        """
        Xfer's the loop from the starting position to the ending position. Must transfer front to back or back to front
        :param starting_pos: the needle to start xfer from
        :param ending_pos: the needle to end xfer from
        :param front_to_back: True if transfer from front to back, false otherwise
        """
        if front_to_back:
            assert self.valid_rack(starting_pos, ending_pos), f"racking {self.racking} does not match f{starting_pos} to b{ending_pos}"
            front_loops = self[(starting_pos, True)]
            assert len(front_loops) > 0, f"No loop at f{starting_pos}"
            for front_loop in front_loops:
                self.add_loop(front_loop, ending_pos, on_front=False, carrier_set=[], drop_prior_loops=False)
            self.drop_loop(starting_pos, on_front=True)
        else:
            assert self.valid_rack(ending_pos, starting_pos), f"racking {self.racking} does not match b{starting_pos} to f{ending_pos}"
            back_loops = self[(starting_pos, False)]
            assert len(back_loops) > 0, f"No loop at b{starting_pos}"
            for back_loop in back_loops:
                self.add_loop(back_loop, ending_pos, on_front=True, carrier_set=[], drop_prior_loops=False)
            self.drop_loop(starting_pos, on_front=False)

    def update_rack(self, front_pos: int, back_pos: int) -> Tuple[int, bool]:
        """
        Updates the current racking to align front and back
        :param front_pos: front needle to align
        :param back_pos: back needle to align
        :return: Return the updated racking, True if the racking is the same as original
        """
        original = self.racking
        self.racking = front_pos - back_pos
        return self.racking, original == self.racking

    def valid_rack(self, front_pos: int, back_pos: int) -> bool:
        """
        :param front_pos: the front needle in the racking
        :param back_pos: the back needle in the racking
        :return: True if the current racking can make this transfer
        """
        needed_rack = front_pos - back_pos
        return self.racking == needed_rack

    def __getitem__(self, item: Union[Tuple[int, bool], Needle]) -> List[int]:
        """
        :param item: the needle post, true if getting from the front
        :return: the loop held on the specified needle and bed
        """
        if isinstance(item, Needle):
            needle_position = item.position
            on_front = item.is_front
        else:
            needle_position = item[0]
            on_front = item[1]
        if on_front:
            return self.front_bed[needle_position]
        else:
            return self.back_bed[needle_position]

    def get_needle_of_loop(self, loop_id: int) -> Optional[Needle]:
        """
        :param loop_id: the loop being searched for
        :return: the needle holding the loop or None if it not held
        """
        front_pos = self.front_bed.get_needle_of_loop(loop_id)
        back_pos = self.back_bed.get_needle_of_loop(loop_id)
        if front_pos is None and back_pos is None:
            return None
        elif front_pos is None:
            return Needle(is_front=False, position=back_pos)
        else:
            assert back_pos is None, f"Loop {loop_id} cannot be on f{front_pos} and b{back_pos}"
            return Needle(is_front=True, position=front_pos)
