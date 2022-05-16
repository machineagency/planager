"""Sets of Operations that happen in groups of carriage passes"""
from enum import Enum
from typing import Optional, Dict

from .Machine_State import Needle
from .machine_operations import *


class Instruction_Type(Enum):
    """An enumerator for the different instruction types in Knitout"""
    Knit = "knit"
    Split = "split"
    Tuck = "tuck"
    Miss = "miss"
    Drop = "drop"
    Xfer = "xfer"

    def direction_must_be_consistent(self) -> bool:
        """
        :return: True if this instruction must be in a consistent carriage pass,
        (all left to right or all right to left),
        in a sorted order
        """
        return self.value in [Instruction_Type.Knit.value, Instruction_Type.Split.value,
                              Instruction_Type.Tuck.value, Instruction_Type.Miss.value]

    def direction_must_be_Left_to_Right(self) -> bool:
        """
        :return: True if the instruction must be in a left to right pass
        """
        return self.value == Instruction_Type.Drop

    def direction_does_not_matter(self) -> bool:
        """
        :return: True
        """
        return self.value == Instruction_Type.Xfer.value


class Carriage_Pass:
    """
    A class that represents a set of instructions made in one pass of the carriage

    ...

    Attributes
    ----------
    machine_state: Machine_State
        The machine that is updated while writing these instructions
    needles_to_instruction_parameters: Dict[Needle, Tuple[Optional[int], Optional[Needle]]]
        The needles each operation starts on mapped to either or both the loop_id created and the second needle involved
    """

    def __init__(self, instruction_type: Instruction_Type, direction: Optional[Pass_Direction],
                 needles_to_instruction_parameters: Dict[Needle, Tuple[Optional[int], Optional[Needle]]],
                 carrier_set: List[Yarn_Carrier],
                 machine_state: Machine_State):
        """
        :param instruction_type: The type of instruction to be done in this pass
        :param direction: the direction the carriage will move for this pass
        :param needles_to_instruction_parameters:
            The starting needles mapped to the loop_id created and a second needle to xfer
        :param carrier_set: The set of yarn carriers involved in each instruction
        :param machine_state: The machine model to update as instructions are written
        """
        self.machine_state: Machine_State = machine_state
        self._carrier_set: List[Yarn_Carrier] = carrier_set
        self.needles_to_instruction_parameters: \
            Dict[Needle, Tuple[Optional[int], Optional[Needle]]] = needles_to_instruction_parameters
        self._direction = direction
        self._instruction_type: Instruction_Type = instruction_type
        if self.direction is None:
            if self.instruction_type.direction_must_be_Left_to_Right():
                self._direction = Pass_Direction.Left_to_Right
            elif self.instruction_type.direction_must_be_consistent():
                self._direction = self.machine_state.last_carriage_direction.opposite()  # switch from last pass
        elif self.instruction_type.direction_must_be_Left_to_Right():
            assert self.direction.value == Pass_Direction.Left_to_Right.value, "Can only Drop on + (left to right) pass"

    @property
    def instruction_type(self) -> Instruction_Type:
        """
        :return: The instruction type in this pass
        """
        return self._instruction_type

    @property
    def direction(self) -> Pass_Direction:
        """
        :return: the direction the carriage will move to complete this pass
        """
        return self._direction

    @property
    def carrier_set(self) -> List[Yarn_Carrier]:
        """
        :return: the set of carriers involved in these instructions
        """
        return self._carrier_set

    def _sorted_needles(self) -> List[Needle]:
        needles = [*self.needles_to_instruction_parameters]
        sorted_left_to_right = sorted(needles)
        if self.direction is Pass_Direction.Right_to_Left:
            return [*reversed(sorted_left_to_right)]
        else:
            return sorted_left_to_right

    def _write_instruction(self, needle: Needle, loop_id: Optional[int],
                           second_needle: Optional[Needle], comment="") -> str:
        """
        :param needle: the first (or only) needle that an instruction uses
        :param loop_id: the loop involved in the operation (used for making comments)
        :param second_needle: the second needle involved in the instructions (i.e., to transfer to
        :param comment: Any specific comments to be included with this instruction
        :return: The string for the line of code executing the instruction
        """
        if self.instruction_type.value == Instruction_Type.Knit.value:
            assert loop_id is not None, "Cannot knit null loop"
            return knit(self.machine_state, self.direction, needle, self.carrier_set, loop_id, comment=comment)
        elif self.instruction_type.value == Instruction_Type.Tuck.value:
            assert loop_id is not None, "Cannot tuck null loop"
            return tuck(self.machine_state, self.direction, needle, self.carrier_set, loop_id, comment=comment)
        elif self.instruction_type.value == Instruction_Type.Split.value:
            assert loop_id is not None, "Cannot split null loop"
            assert second_needle is not None, "Two needles needed to split"
            return split(self.machine_state, self.direction, needle, second_needle, self.carrier_set, loop_id,
                         comment=comment)
        elif self.instruction_type.value == Instruction_Type.Drop.value:
            return drop(self.machine_state, needle, comment=comment)
        elif self.instruction_type.value == Instruction_Type.Xfer.value:
            assert second_needle is not None, "Two needles needed to split"
            return xfer(self.machine_state, needle, second_needle, comment=comment)
        elif self.instruction_type.value == Instruction_Type.Miss.value:
            return miss(self.direction, needle, self.carrier_set, comment=comment)
        else:
            assert False, "The instruction was not recognized"

    def write_instructions(self, first_comment="", comment="") -> List[str]:
        """
        :param first_comment: A comment to add to the first instruction in the pass
        :param comment: A comment to add to every instruction in the pass
        :return: A list of knitout instructions that executes the instruction on each needle
        """
        # bring in yarns that are not yet in operation
        instructions = []
        in_hooked_carriers = set()
        for carrier in self.carrier_set:
            if carrier not in self.machine_state.yarns_in_operation:
                in_hooked_carriers.add(carrier)
                instructions.append(inhook(self.machine_state, [carrier]))

        starting_needles = self._sorted_needles()
        for needle in starting_needles:
            loop_id, second_needle = self.needles_to_instruction_parameters[needle]
            if len(instructions) == 0:
                c = first_comment
            else:
                c = comment
            instruction = self._write_instruction(needle, loop_id, second_needle, comment=c)
            instructions.append(instruction)
        self.machine_state.last_carriage_direction = self.direction

        # release hooks on second pass with inhooks
        for carrier in [*self.machine_state.in_hooks]:
            if carrier not in in_hooked_carriers:  # don't release hook on first pass with in hook
                instructions.append(releasehook(self.machine_state, [carrier]))
        return instructions
